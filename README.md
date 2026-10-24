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

The release center reads the latest stable Mark-56 GitHub Release and identifies installer assets by platform. The download endpoint redirects directly only to a compatible installer asset hosted at the official GitHub Release download path. It rejects source archives, checksums, metadata files, and packages for another platform.

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
