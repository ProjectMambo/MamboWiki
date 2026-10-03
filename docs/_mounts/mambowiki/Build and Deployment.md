---
title: MamboWiki build and deployment
description: Validate, preview, and deploy the MamboSite-powered Wiki through GitHub Pages.
order: 30
---

::page{layout="docs" width="normal" sidebar=true}

# MamboWiki build and deployment

## Local commands

```bash
npm ci
npm run check
npm run dev
npm run build
npm run preview
```

`npm run check` is the complete repository gate: mounted-content validation, the strict MamboDocs contract, clean-clone package and generated-content preparation, ESLint, TypeScript, a reproducible static build, artifact existence, and whitespace checks. It requires sibling MamboSite commit `43f861f6f4a0f1504753faf4b6113e2e75636f59` and MamboDocs commit `95e29a78e7e77e3dae6a6c8c410020351c4e0b6c`. `npm run dev` first builds the sibling MamboSite packages and regenerates content, then starts Next.js. `npm run build` runs one complete `mbsite build`, including the configured static renderer, and writes `out/`. `npm run preview` serves that completed directory at `http://127.0.0.1:4173`.

Next.js 16 does not run linting as part of `next build`, so the unified check prepares clean-clone prerequisites, then keeps explicit ESLint and TypeScript stages before the reproducible production build.

## Reproducible local review

MamboSite records the footer build time and seeds presentation accents from the build environment. The unified check sets a fixed source epoch when comparing generated output or screenshots:

```bash
npm run check
```

Production deploys omit `SOURCE_DATE_EPOCH`, so the footer formats the actual CI build instant in `Asia/Singapore`.

Generated content and assets are ignored by Git. The committed inputs are the synchronized docs, configuration, shell, dependency manifests, and workflow.

## CI pipeline

The GitHub Pages workflow:

1. Checks out MamboWiki, MamboSite, and MamboDocs into sibling directories at exact revisions.
2. Installs Rust 1.95.0 through the runner's native `rustup` and pins Node.js 20 and both npm lockfiles.
3. Installs both npm repositories with `npm ci` and exposes the checked-out MamboSite command wrapper.
4. Runs `npm run check`, including the strict pinned documentation checker and reproducible static export.
5. Rebuilds without `SOURCE_DATE_EPOCH` so the deployed footer records the actual CI build time.
6. Uploads `MamboWiki/out` as the Pages artifact.
7. Deploys through the `github-pages` environment.

The workflow grants only `contents: read` while building. `pages: write` and `id-token: write` are scoped to the deploy job.

GitHub Pages must use **GitHub Actions** as its publishing source. The custom domain is configured in the repository's Pages settings; the retained `CNAME` is not used by the uploaded artifact workflow.

## Before deployment

- Confirm `main` is the configured branch and is not behind or diverged from `origin/main`.
- Confirm the working tree remains clean after a complete local build.
- Review the exact commits and the locally served artifact.
- Confirm the MamboSite pin matches the package/runtime behavior tested locally.
- Confirm no private vault-only data appears in `README.md` or `docs/`.
- Preview narrow and wide layouts and the not-found page in a browser.
- Review keyboard navigation, visible focus, heading order, contrast, and reduced-motion behavior.
- Confirm the static site still has no analytics, forms, accounts, cookies, or user-data collection, or review and document any intentional change to that boundary.

## Deploy

From a clean `main` branch:

```bash
npm run deploy
```

`mbsite deploy` performs the complete local build, fetches the configured remote branch, pushes local commits when ahead, and relies on the workflow's push trigger. If the same commit is already remote, it dispatches the workflow instead. It never creates a commit.

Preview the resolved external action without fetching, pushing, or dispatching:

```bash
npm run deploy -- --dry-run
```

Do not manually push and then immediately run `npm run deploy`; that starts a second workflow run for the same commit. The command starts CI but does not wait for GitHub Pages to finish, so inspect the workflow and Pages deployment result separately.

## Post-deploy verification

After the Actions and Pages jobs succeed, open [projectmambo.org](https://projectmambo.org) in a fresh browser session. Verify the landing page, at least two project roots, a deep guide, assets, primary navigation, the not-found page, and the footer build time. Repeat the keyboard and responsive smoke checks against the live artifact.

## Rollback

Create a normal `git revert <bad-commit>` on `main`, run `npm run check`, and deploy the revert. If the failure came from a provider pin or lockfile change, revert the consumer commit rather than moving an existing pin. Do not rewrite published branch history.
