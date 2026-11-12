# JARVIS Website

The official website and release hub for the JARVIS desktop AI assistant. This repository is separate from the existing Mark-56 application repository, so the public site can evolve without replacing or breaking the desktop app.

## Site pages

- / — Overview and paths into the product
- /features — Capabilities and feature status
- /offline — Local AI and Ollama setup guide
- /downloads — Platform-specific installer availability and direct downloads
- /updates — Current release-check capability and intended update policy
- /faq — User help and common questions

The site uses shared navigation and footer components, a mobile navigation menu, scroll-triggered reveal animations, subtle page transitions and interaction states. It respects the operating system's reduced-motion preference. Animation behavior is built with CSS and the Intersection Observer API; there is no animation framework dependency.

## Technology

- Next.js App Router + React + TypeScript
- Tailwind CSS v4 via PostCSS, with a custom responsive design system
- Lucide icons
- Vercel-friendly deployment and build configuration
- GitHub Actions CI for linting and production builds

## Run locally

Requirements: Node.js 20.9 or newer and npm.

```bash
git clone https://github.com/ibarakumo2000-stack/Jarvis-Website.git
cd Jarvis-Website
npm install
npm run dev
```

Open http://localhost:3000.

For a production build:

```bash
npm run lint
npm run build
npm start
```

## Environment variables

Copy .env.example to .env.local if you want to customize destination links:

- NEXT_PUBLIC_SITE_URL: canonical URL for the deployed website and sitemap.
- NEXT_PUBLIC_DESKTOP_RELEASES_URL: release-page fallback destination. It defaults to the Mark-56 GitHub releases page.

Never put private API keys or signing credentials in a NEXT_PUBLIC_* variable. Values with that prefix are exposed to the browser.

## Releases and installers

The release center reads the latest stable Mark-56 desktop release and identifies installer assets by platform. Android downloads are handled separately: the page accepts only a versioned, non-prerelease `companion-vX.Y.Z` release containing the exact `JARVIS-Companion.apk` asset. The release workflow builds with the owner-managed signing key, verifies the phone and Wear OS APK signatures, checks their package IDs, and publishes SHA-256 checksums. Rolling preview/debug APKs and Actions artifacts are never served as public Android downloads.

The download endpoint redirects only to compatible official GitHub Release assets. It rejects source archives, checksums, metadata files, debug APKs, and packages for another platform.

If no stable release or platform installer exists yet, the release center keeps the platform marked as in preparation and the download route returns the visitor to /downloads instead of exposing a raw API error or downloading source code. Do not advertise an installer as available until a real, tested release asset exists.

The website does not build desktop binaries or run local AI in the browser. The intended release process is:

1. Package the actual JARVIS/Mark-56 desktop app for each supported operating system.
2. Test each installer on a clean machine and publish assets and release notes.
3. Confirm the release center discovers the new assets and each platform download works.
4. Integrate and test the desktop updater against the published release metadata.

Offline local inference belongs in the installed desktop app. Users need internet for first-time downloads of the app, Ollama (if required), and local AI model files. Supported local tasks can then work offline; web research and cloud providers still require a connection.

### Cross-platform updater note

The desktop updater must be implemented and tested in the application, not the website. The selected user experience is: check in the background, download an update, show the version/release notes, and ask for confirmation before installing. Each platform needs its own packaging and signing/release setup. Linux packaging and updating need a deliberately selected strategy; macOS automatic update support also needs an appropriate signed app distribution path.

## Deploy on Vercel

1. Import ibarakumo2000-stack/Jarvis-Website as a new Vercel project.
2. Select the Next.js framework preset.
3. Set NEXT_PUBLIC_SITE_URL to the actual production origin.
4. Optionally set NEXT_PUBLIC_DESKTOP_RELEASES_URL to the official public release page.
5. Deploy with npm run build as the build command.

## Project status

The multi-page website, responsive navigation, animation system, download-asset discovery, offline setup explanation, platform cards, help pages, SEO metadata, custom 404 page and CI checks are implemented in this repository. This does not mean desktop installers or secure automatic app installation have already shipped.


## Paid licences and secure downloads

The commerce implementation provides three checkout choices:

- **JARVIS 56.0.0 lifetime licence:** a one-time purchase pinned to the exact classic release. It must never fall back to the latest release.
- **JARVIS Premium monthly:** a recurring Paystack plan granting access to the current premium release while active.
- **JARVIS Premium yearly:** a recurring Paystack plan granting access to the current premium release while active.

Payment initialization and verification run on the server. A successful callback is not trusted by itself: the website verifies the Paystack transaction, checks the email, currency and one-time amount, records an entitlement, then issues a short-lived HTTP-only download authorization cookie. Recurring subscription webhooks update entitlement status. The download endpoint checks the entitlement again and issues a 60-second signed URL.

### Required setup before enabling checkout

1. Create a Supabase project and run `database/jarvis-commerce.sql` in its SQL editor.
2. Add the server-only variables from `.env.example` to Vercel. Never use a `NEXT_PUBLIC_` prefix for payment secrets, Supabase service-role credentials, R2 credentials or the download signing secret.
3. The current fixed prices are **NGN 1,000 once** for JARVIS 56.0.0, **NGN 1,500 monthly** for JARVIS Premium, and **NGN 2,000 annually** for JARVIS Premium. Create the monthly and annual Paystack plans at exactly those amounts (150000 and 200000 kobo respectively), then set their plan codes in Vercel. The checkout endpoint checks each plan's amount, interval and currency against the website price before initializing payment. Update the pricing constants in `src/lib/payments.ts` and the Paystack plans together whenever prices change.
4. Configure the merchant settlement destination in Paystack Dashboard under **Settings → Accounts**. Confirm the displayed beneficiary name and account before saving. The payout account details are deliberately not committed to source control, placed in public website code, or stored in `.env`. Paystack controls settlements to the configured payout account; the website does not initiate a transfer to a personal account.
5. Configure the Paystack webhook URL as `https://YOUR_DOMAIN/api/paystack/webhook`. Paystack signs webhook requests with your server-side `PAYSTACK_SECRET_KEY`; the endpoint verifies the `x-paystack-signature` HMAC-SHA512 header.
6. Create a **private** Cloudflare R2 bucket. Upload separate classic 56.0.0 and premium desktop installers and set each object key in the matching `JARVIS_*_OBJECT_KEY` variable.
7. Test successful, failed, cancelled and recurring payments with Paystack test keys before switching to live keys.

### Important release-publishing requirement

Desktop installers must not remain attached to public GitHub Releases once the paid store goes live. Public GitHub release assets can be downloaded directly and cannot be protected by a website paywall. The release pipeline must upload desktop binaries to the private R2 bucket instead. GitHub Releases may continue to publish public release notes and non-sensitive checksums, but must not expose paid installer binaries. Android companion distribution remains separate.

The desktop application also needs its own licence activation and feature-entitlement checks if premium functionality is to be disabled after a subscription expires. A website download entitlement alone cannot prevent a previously downloaded installer from being copied or used offline.
