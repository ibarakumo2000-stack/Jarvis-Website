import { GetObjectCommand, HeadObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { PurchasePlan } from "@/lib/payments";
import type { DesktopPlatform } from "@/lib/releases";

let client: S3Client | null = null;

function getClient() {
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("Private installer storage is not configured.");
  }
  if (!client) {
    client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return client;
}

function objectKey(plan: PurchasePlan, platform: DesktopPlatform, architecture?: string): string | null {
  const tier = plan === "lifetime" ? "CLASSIC" : "PREMIUM";
  let suffix = platform.toUpperCase();
  if (platform === "macos") {
    if (architecture === "arm64" || architecture === "x86_64") suffix += architecture === "arm64" ? "_ARM64" : "_X86_64";
    else suffix += "_UNIVERSAL";
  }
  const value = process.env[`JARVIS_${tier}_${suffix}_OBJECT_KEY`]?.trim();
  return value || null;
}

export async function getPrivateInstallerUrl(
  plan: PurchasePlan,
  platform: DesktopPlatform,
  architecture?: string,
): Promise<string | null> {
  const bucket = process.env.R2_BUCKET_NAME?.trim();
  const key = objectKey(plan, platform, architecture);
  if (!bucket || !key) return null;
  const s3 = getClient();
  try {
    await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return await getSignedUrl(
      s3,
      new GetObjectCommand({ Bucket: bucket, Key: key }),
      { expiresIn: 60 },
    );
  } catch (error) {
    console.error("[private installer storage]", error);
    return null;
  }
}
