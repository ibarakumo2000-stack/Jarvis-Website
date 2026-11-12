export type DesktopPlatform = "windows" | "linux" | "macos";

export type MacArchitecture = "arm64" | "x86_64";

export type InstallerAsset = {
  name: string;
  url: string;
  size?: number;
};

export type LatestDesktopRelease = {
  tag_name: string;
  html_url: string;
  published_at?: string;
  checksums?: InstallerAsset;
  macosVariants: Partial<Record<MacArchitecture, InstallerAsset>>;
  assets: Partial<Record<DesktopPlatform, InstallerAsset>>;
};

const RELEASE_API =
  "https://api.github.com/repos/ibarakumo2000-stack/Mark-56/releases/latest";
const OFFICIAL_DOWNLOAD_PREFIX =
  "https://github.com/ibarakumo2000-stack/Mark-56/releases/download/";

function assetMatches(name: string, platform: DesktopPlatform): boolean {
  const lower = name.toLowerCase();

  // Never treat checksums, metadata, release notes, or source archives as installers.
  if (
    /sha256|checksum|checksums|build-info|release-notes|source-code|\.json$|\.txt$/.test(
      lower,
    )
  ) {
    return false;
  }

  if (platform === "windows") return /\.(exe|msi)$/i.test(lower);
  if (platform === "linux") {
    return (
      /\.(appimage|deb|rpm)$/i.test(lower) ||
      /linux.*\.tar\.gz$/i.test(lower)
    );
  }
  return /\.(dmg|pkg)$/i.test(lower) || /(macos|darwin).*\.zip$/i.test(lower);
}

function preferredAsset(
  assets: InstallerAsset[],
  platform: DesktopPlatform,
): InstallerAsset | undefined {
  const preference: Record<DesktopPlatform, string[]> = {
    windows: [".exe", ".msi"],
    linux: [".appimage", ".deb", ".rpm", ".tar.gz"],
    macos: [".dmg", ".pkg", ".zip"],
  };
  return assets
    .filter((asset) => assetMatches(asset.name, platform))
    .sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const aRank = preference[platform].findIndex((extension) =>
        aName.endsWith(extension),
      );
      const bRank = preference[platform].findIndex((extension) =>
        bName.endsWith(extension),
      );
      return (aRank < 0 ? 999 : aRank) - (bRank < 0 ? 999 : bRank);
    })[0];
}

/**
 * Reads the latest stable public release, returning only installer assets whose
 * URLs are under the official Mark-56 GitHub Releases download path.
 *
 * The response is cached briefly by Next.js so public site traffic does not
 * repeatedly consume the unauthenticated GitHub API rate limit.
 */
export async function getLatestDesktopRelease(): Promise<LatestDesktopRelease | null> {
  try {
    const response = await fetch(RELEASE_API, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "JARVIS-Website",
      },
      next: { revalidate: 120 },
      signal: AbortSignal.timeout(6000),
    });

    // GitHub returns 404 when no stable release exists yet.
    if (response.status === 404 || !response.ok) return null;

    const payload: unknown = await response.json();
    if (!payload || typeof payload !== "object") return null;

    const release = payload as {
      tag_name?: unknown;
      html_url?: unknown;
      published_at?: unknown;
      draft?: unknown;
      prerelease?: unknown;
      assets?: unknown;
    };

    if (release.draft || release.prerelease) return null;
    const tag = typeof release.tag_name === "string" ? release.tag_name : "";
    if (!/^v?\d+\.\d+\.\d+$/.test(tag)) return null;

    const assetsRaw = Array.isArray(release.assets) ? release.assets : [];
    const assets: InstallerAsset[] = assetsRaw.flatMap((candidate) => {
      if (!candidate || typeof candidate !== "object") return [];
      const asset = candidate as {
        name?: unknown;
        browser_download_url?: unknown;
        size?: unknown;
      };
      if (
        typeof asset.name !== "string" ||
        typeof asset.browser_download_url !== "string" ||
        !asset.browser_download_url.startsWith(OFFICIAL_DOWNLOAD_PREFIX)
      ) {
        return [];
      }
      return [{
        name: asset.name,
        url: asset.browser_download_url,
        ...(typeof asset.size === "number" ? { size: asset.size } : {}),
      }];
    });

    const htmlUrl =
      typeof release.html_url === "string" &&
      release.html_url.startsWith(
        "https://github.com/ibarakumo2000-stack/Mark-56/releases/",
      )
        ? release.html_url
        : "https://github.com/ibarakumo2000-stack/Mark-56/releases";

    const macosPackages = assets.filter(
      (asset) =>
        /(?:macos|darwin)/i.test(asset.name) &&
        /\.(dmg|pkg)$/i.test(asset.name),
    );
    const macosVariants: LatestDesktopRelease["macosVariants"] = {
      arm64: macosPackages.find((asset) =>
        /(?:arm64|aarch64|apple[-_ ]?silicon)/i.test(asset.name),
      ),
      x86_64: macosPackages.find((asset) =>
        /(?:x86_64|intel|x64)/i.test(asset.name),
      ),
    };

    return {
      tag_name: tag,
      html_url: htmlUrl,
      ...(typeof release.published_at === "string"
        ? { published_at: release.published_at }
        : {}),
      checksums: assets.find((asset) => /^(sha256sums|checksums)\.txt$/i.test(asset.name)),
      macosVariants,
      assets: {
        windows: preferredAsset(assets, "windows"),
        linux: preferredAsset(assets, "linux"),
        macos: preferredAsset(assets, "macos"),
      },
    };
  } catch {
    // A missing release service must not break the public landing page.
    return null;
  }
}


export type AndroidCompanionRelease = {
  tag_name: string;
  html_url: string;
  published_at?: string;
  apk: InstallerAsset;
  watchApk?: InstallerAsset;
  checksums?: InstallerAsset;
};

const ANDROID_RELEASES_API =
  "https://api.github.com/repos/ibarakumo2000-stack/Mark-56/releases?per_page=50";

function officialAndroidAsset(
  candidates: unknown[],
  expectedName: string,
): InstallerAsset | undefined {
  const item = candidates.find((candidate) => {
    if (!candidate || typeof candidate !== "object") return false;
    const asset = candidate as {
      name?: unknown;
      browser_download_url?: unknown;
    };
    return asset.name === expectedName &&
      typeof asset.browser_download_url === "string" &&
      asset.browser_download_url.startsWith(OFFICIAL_DOWNLOAD_PREFIX);
  }) as {
    name: string;
    browser_download_url: string;
    size?: number;
  } | undefined;

  if (!item) return undefined;
  return {
    name: item.name,
    url: item.browser_download_url,
    ...(typeof item.size === "number" ? { size: item.size } : {}),
  };
}

/**
 * Returns only an owner-signed, versioned Android release.
 * Debug APKs from Actions artifacts and the old rolling preview are never
 * eligible for the public download page.
 */
export async function getAndroidCompanionRelease(): Promise<AndroidCompanionRelease | null> {
  try {
    const response = await fetch(ANDROID_RELEASES_API, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "JARVIS-Website",
      },
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) return null;

    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) return null;

    const releases = payload
      .filter((candidate): candidate is Record<string, unknown> =>
        !!candidate && typeof candidate === "object")
      .filter((release) =>
        release.draft === false &&
        release.prerelease === false &&
        typeof release.tag_name === "string" &&
        /^companion-v\d+\.\d+\.\d+$/.test(release.tag_name))
      .sort((a, b) => {
        const aDate = typeof a.published_at === "string" ? Date.parse(a.published_at) : 0;
        const bDate = typeof b.published_at === "string" ? Date.parse(b.published_at) : 0;
        return bDate - aDate;
      });

    for (const release of releases) {
      const tag = release.tag_name as string;
      const assets = Array.isArray(release.assets) ? release.assets : [];
      const apk = officialAndroidAsset(assets, "JARVIS-Companion.apk");
      if (!apk) continue;

      const htmlUrl =
        typeof release.html_url === "string" &&
        release.html_url.startsWith("https://github.com/ibarakumo2000-stack/Mark-56/releases/")
          ? release.html_url
          : "https://github.com/ibarakumo2000-stack/Mark-56/releases";

      return {
        tag_name: tag,
        html_url: htmlUrl,
        ...(typeof release.published_at === "string" ? { published_at: release.published_at } : {}),
        apk,
        watchApk: officialAndroidAsset(assets, "JARVIS-Watch.apk"),
        checksums: officialAndroidAsset(assets, "SHA256SUMS.txt"),
      };
    }
    return null;
  } catch {
    return null;
  }
}


/**
 * Resolve the exact classic release reserved for one-time licence holders.
 * Accepts both GitHub tag spellings used by the project, but never falls back
 * to the latest release (which may contain subscription-only features).
 */
export async function getDesktopReleaseByTag(version: "56.0.0"): Promise<LatestDesktopRelease | null> {
  for (const tag of [`v${version}`, version]) {
    try {
      const response = await fetch(
        `https://api.github.com/repos/ibarakumo2000-stack/Mark-56/releases/tags/${tag}`,
        {
          headers: { Accept: "application/vnd.github+json", "User-Agent": "JARVIS-Website" },
          next: { revalidate: 120 },
          signal: AbortSignal.timeout(6000),
        },
      );
      if (!response.ok) continue;
      const release = await response.json() as {
        tag_name?: unknown; html_url?: unknown; published_at?: unknown;
        draft?: unknown; prerelease?: unknown; assets?: unknown;
      };
      if (release.draft || release.prerelease || release.tag_name !== tag) continue;
      const assetsRaw = Array.isArray(release.assets) ? release.assets : [];
      const assets: InstallerAsset[] = assetsRaw.flatMap((candidate) => {
        if (!candidate || typeof candidate !== "object") return [];
        const asset = candidate as { name?: unknown; browser_download_url?: unknown; size?: unknown };
        if (typeof asset.name !== "string" || typeof asset.browser_download_url !== "string" ||
            !asset.browser_download_url.startsWith(OFFICIAL_DOWNLOAD_PREFIX)) return [];
        return [{
          name: asset.name,
          url: asset.browser_download_url,
          ...(typeof asset.size === "number" ? { size: asset.size } : {}),
        }];
      });
      const macosPackages = assets.filter((asset) =>
        /(?:macos|darwin)/i.test(asset.name) && /\.(dmg|pkg)$/i.test(asset.name));
      const macosVariants: LatestDesktopRelease["macosVariants"] = {
        arm64: macosPackages.find((asset) => /(?:arm64|aarch64|apple[-_ ]?silicon)/i.test(asset.name)),
        x86_64: macosPackages.find((asset) => /(?:x86_64|intel|x64)/i.test(asset.name)),
      };
      return {
        tag_name: tag,
        html_url: typeof release.html_url === "string" &&
          release.html_url.startsWith("https://github.com/ibarakumo2000-stack/Mark-56/releases/")
          ? release.html_url : "https://github.com/ibarakumo2000-stack/Mark-56/releases",
        ...(typeof release.published_at === "string" ? { published_at: release.published_at } : {}),
        checksums: assets.find((asset) => /^(sha256sums|checksums)\.txt$/i.test(asset.name)),
        macosVariants,
        assets: {
          windows: preferredAsset(assets, "windows"),
          linux: preferredAsset(assets, "linux"),
          macos: preferredAsset(assets, "macos"),
        },
      };
    } catch {
      return null;
    }
  }
  return null;
}
