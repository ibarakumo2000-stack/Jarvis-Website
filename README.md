# JARVIS Website

The official website and release hub for the JARVIS desktop AI assistant. This repository is intentionally separate from the existing Mark-56 application repository so the public website can be developed without changing or breaking Mark-56.

## Technology

- Next.js App Router + React + TypeScript
- Tailwind CSS v4 via PostCSS, with a custom responsive design system
- Lucide icons
- Vercel-friendly deployment and build configuration
- GitHub Actions build check

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
npm run build
npm start
```

## Environment variables

Copy `.env.example` to `.env.local` if you want to customize the destination links:

- `NEXT_PUBLIC_SITE_URL`: canonical URL for the deployed website.
- `NEXT_PUBLIC_DESKTOP_RELEASES_URL`: the GitHub releases page used by the download center. It defaults to the Mark-56 repository's releases page.

Never put private API keys or signing credentials in a `NEXT_PUBLIC_*` variable. Values with that prefix are exposed to the browser.

## Releases and installers

The download center currently points visitors to the official Mark-56 release page and clearly indicates that public desktop installers are not yet published. Do not advertise an installer as available until a real, tested release asset exists.

The site itself does not create desktop installers or run local AI in the browser. The intended release process is:

1. Package the actual JARVIS/Mark-56 desktop application for each supported operating system.
2. Test each installer on a clean machine and publish the installable assets and release notes.
3. Connect the website's release links to those assets.
4. Integrate and test the desktop updater against the published release metadata.

Offline local inference belongs in the installed desktop app. Users need an internet connection for first-time downloads of the application, Ollama (if needed), and local AI model files. Supported local tasks can then work offline; online research and cloud providers still require a connection.

### Cross-platform updater note

The desktop updater must be implemented and tested in the desktop application, not the website. The selected user experience is: check in the background, download an update, show the version/release notes, and ask for confirmation before installing. Each platform needs its own packaging and signing/release setup; macOS automatic updates require a signed app. Linux packaging and updating need a deliberately selected strategy.

## Deployment on Vercel

1. Import `ibarakumo2000-stack/Jarvis-Website` as a new Vercel project.
2. Select the Next.js framework preset.
3. Set `NEXT_PUBLIC_SITE_URL` to the actual production URL.
4. Optionally set `NEXT_PUBLIC_DESKTOP_RELEASES_URL` to the final public desktop releases page.
5. Deploy. The standard build command is `npm run build`.

## Project status

This is the first website/release-hub milestone. The marketing site, responsive layouts, offline-setup explanation, platform sections, FAQ, SEO metadata, and CI build check live here. It is not evidence that the desktop binaries or automatic updater have already been shipped.
