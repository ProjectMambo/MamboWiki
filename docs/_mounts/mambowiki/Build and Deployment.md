---
title: MamboWiki Build and Deployment
description: Validate, preview, and eventually deploy the MamboSite-powered Wiki through GitHub Pages.
order: 30
---

::page{layout="docs" width="normal" sidebar=true}

# MamboWiki Build and Deployment

## Local commands

```bash
npm ci
npm run content:check
npm run dev
npm run build
npm run preview
```

`npm run dev` first builds the sibling MamboSite packages and regenerates content, then starts Next.js. `npm run build` runs one complete `mbsite build`, including the configured static renderer, and writes `out/`. `npm run preview` serves that completed directory at `http://127.0.0.1:4173`.

Use `npm run lint` and `npm run typecheck` as separate source checks. The full build is the authoritative content-plus-renderer gate.

## Reproducible local review

MamboSite may seed presentation accents from the build environment. Set a fixed source epoch when comparing generated output or screenshots:

```bash
SOURCE_DATE_EPOCH=0 npm run build
```

Generated content and assets are ignored by Git. The committed inputs are the synchronized docs, configuration, shell, dependency manifests, and workflow.

## CI pipeline

The GitHub Pages workflow:

1. Checks out MamboWiki and MamboSite into sibling directories.
2. Pins the MamboSite commit, Rust toolchain, Node.js version, and npm lockfiles.
3. Installs both repositories with `npm ci`.
4. Runs the MamboSite compiler against `MamboWiki/mambo.toml`.
5. Builds the Next.js static export.
6. Uploads `MamboWiki/out` as the Pages artifact.
7. Deploys through the `github-pages` environment.

GitHub Pages must use **GitHub Actions** as its publishing source. The custom domain is configured in the repository's Pages settings; the retained `CNAME` is not used by the uploaded artifact workflow.

## Before deployment

- Confirm `main` is the configured branch and is not behind or diverged from `origin/main`.
- Confirm the working tree remains clean after a complete local build.
- Review the exact commits and the locally served artifact.
- Confirm the MamboSite pin matches the package/runtime behavior tested locally.
- Confirm no private vault-only data appears in `README.md` or `docs/`.

## Manual-review hold

The current MamboSite migration must remain local until its site and documentation are manually reviewed. A successful build is not permission to push it.

## Deploy after approval

From a clean reviewed `main` branch:

```bash
npm run deploy
```

`mbsite deploy` performs the complete local build, fetches the configured remote branch, pushes local commits when ahead, and relies on the workflow's push trigger. If the same commit is already remote, it dispatches the workflow instead. It never creates a commit.

Preview the resolved external action without fetching, pushing, or dispatching:

```bash
npm run deploy -- --dry-run
```

Do not manually push and then immediately run `npm run deploy`; that starts a second workflow run for the same commit. The command starts CI but does not wait for GitHub Pages to finish, so inspect the workflow and Pages deployment result separately.
