import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RELEASE_API =
  "https://api.github.com/repos/ibarakumo2000-stack/Mark-56/releases/latest";

type Platform = "windows" | "linux" | "macos";

type ReleaseAsset = {
  name?: string;
  browser_download_url?: string;
};

function detectPlatform(request: NextRequest): Platform | null {
  const requested = request.nextUrl.searchParams.get("platform")?.toLowerCase();

  if (requested === "windows" || requested === "linux" || requested === "macos") {
    return requested;
  }

  const agent = request.headers.get("user-agent") ?? "";
  if (/windows/i.test(agent)) return "windows";
  if (/macintosh|mac os x|mac_powerpc/i.test(agent)) return "macos";
  if (/linux|x11/i.test(agent)) return "linux";
  return null;
}

function assetMatches(name: string, platform: Platform): boolean {
  const lower = name.toLowerCase();

  // Never choose checksums, release notes, metadata, or source archives.
  if (
    /sha256|checksum|checksums|build-info|release-notes|source-code|\.json$|\.txt$/.test(
      lower,
    )
  ) {
    return false;
  }

  if (platform === "windows") return /\.(exe|msi)$/i.test(lower);
  if (platform === "linux") {
    return /\.(appimage|deb|rpm)$/i.test(lower) || /linux.*\.tar\.gz$/i.test(lower);
  }
  return /\.(dmg|pkg)$/i.test(lower) || /(macos|darwin).*\.zip$/i.test(lower);
}

function downloadsFallback(request: NextRequest): NextResponse {
  const fallback = new URL("/?download=not-ready#downloads", request.url);
  return NextResponse.redirect(fallback, 307);
}

export async function GET(request: NextRequest) {
  const platform = detectPlatform(request);
  if (!platform) return downloadsFallback(request);

  try {
    const response = await fetch(RELEASE_API, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "JARVIS-Website-Download",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });

    // No latest release is a normal state before the first installer publish.
    if (response.status === 404) return downloadsFallback(request);
    if (!response.ok) return downloadsFallback(request);

    const release: unknown = await response.json();
    if (!release || typeof release !== "object") return downloadsFallback(request);

    const data = release as { draft?: boolean; prerelease?: boolean; assets?: ReleaseAsset[] };
    if (data.draft || data.prerelease || !Array.isArray(data.assets)) {
      return downloadsFallback(request);
    }

    const asset = data.assets.find(
      (item) =>
        typeof item?.name === "string" &&
        typeof item.browser_download_url === "string" &&
        item.browser_download_url.startsWith(
          "https://github.com/ibarakumo2000-stack/Mark-56/releases/download/",
        ) &&
        assetMatches(item.name, platform),
    );

    // A platform is downloadable only if a real installer is attached to the
    // stable release. Until then, route visitors back to the release center.
    if (!asset?.browser_download_url) return downloadsFallback(request);

    return NextResponse.redirect(asset.browser_download_url, 302);
  } catch {
    // A download button should never expose a raw API or stack-trace error.
    return downloadsFallback(request);
  }
}
