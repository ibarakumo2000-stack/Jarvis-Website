import { NextRequest, NextResponse } from "next/server";
import {
  getLatestDesktopRelease,
  type DesktopPlatform,
} from "@/lib/releases";

export const runtime = "nodejs";

function detectPlatform(request: NextRequest): DesktopPlatform | null {
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

function downloadsFallback(request: NextRequest): NextResponse {
  return NextResponse.redirect(
    new URL("/downloads?download=not-ready", request.url),
    307,
  );
}

export async function GET(request: NextRequest) {
  const platform = detectPlatform(request);
  if (!platform) return downloadsFallback(request);

  const release = await getLatestDesktopRelease();
  const architecture = request.nextUrl.searchParams.get("arch")?.toLowerCase();
  const asset =
    platform === "macos"
      ? architecture === "arm64" || architecture === "x86_64"
        ? release?.macosVariants[architecture]
        : release?.assets.macos
      : release?.assets[platform];

  // Redirect only to a real, stable-release installer for the requested OS.
  // If a package has not been published yet, return the visitor to the release
  // center instead of exposing an API error or downloading source code.
  if (!asset?.url) return downloadsFallback(request);

  return NextResponse.redirect(asset.url, 302);
}
