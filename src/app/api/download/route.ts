import { NextRequest, NextResponse } from "next/server";
import { entitlementIsActive, getEntitlement, readDownloadToken } from "@/lib/payments";
import { getPrivateInstallerUrl } from "@/lib/private-downloads";
import { getAndroidCompanionRelease, type DesktopPlatform } from "@/lib/releases";

export const runtime = "nodejs";

function detectPlatform(request: NextRequest): DesktopPlatform | null {
  const requested = request.nextUrl.searchParams.get("platform")?.toLowerCase();
  if (requested === "windows" || requested === "linux" || requested === "macos") return requested;
  const agent = request.headers.get("user-agent") ?? "";
  if (/windows/i.test(agent)) return "windows";
  if (/macintosh|mac os x|mac_powerpc/i.test(agent)) return "macos";
  if (/linux|x11/i.test(agent)) return "linux";
  return null;
}

function downloadsFallback(request: NextRequest, reason = "not-ready"): NextResponse {
  return NextResponse.redirect(new URL(`/downloads?download=${reason}`, request.url), 307);
}

export async function GET(request: NextRequest) {
  const requested = request.nextUrl.searchParams.get("platform")?.toLowerCase();
  // Android companion remains a separately published companion package.
  if (requested === "android") {
    const androidRelease = await getAndroidCompanionRelease();
    if (!androidRelease?.apk.url) return downloadsFallback(request);
    return NextResponse.redirect(androidRelease.apk.url, 302);
  }

  const token = request.cookies.get("jarvis_download_token")?.value ?? "";
  if (!token) return NextResponse.redirect(new URL("/pricing?purchase=required", request.url), 307);
  const claims = readDownloadToken(token);
  if (!claims) return NextResponse.redirect(new URL("/pricing?purchase=expired", request.url), 307);

  try {
    const entitlement = await getEntitlement(claims.email);
    if (!entitlementIsActive(entitlement)) {
      return NextResponse.redirect(new URL("/pricing?purchase=inactive", request.url), 307);
    }
    const platform = detectPlatform(request);
    if (!platform) return downloadsFallback(request, "platform-unknown");

    const architecture = request.nextUrl.searchParams.get("arch")?.toLowerCase();
    const signedUrl = await getPrivateInstallerUrl(entitlement.plan, platform, architecture);
    if (!signedUrl) {
      return downloadsFallback(request, platform === "macos" && !architecture ? "choose-macos-architecture" : "private-installer-not-published");
    }
    const response = NextResponse.redirect(signedUrl, 302);
    return response;
  } catch (error) {
    console.error("[authorized download]", error);
    return downloadsFallback(request, "temporarily-unavailable");
  }
}
