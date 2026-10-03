# MamboWiki

<p align="left">
  <img src="https://img.shields.io/badge/GitHub_Pages-222222?style=flat-square&logo=githubpages&logoColor=white" alt="GitHub Pages" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/MamboSite-000000?style=flat-square&logoColor=white" alt="MamboSite" />
  <img src="https://img.shields.io/badge/Deploy-Live-brightgreen?style=flat-square" alt="Deployment status: live" />
</p>
<p align="left">
  <img src="https://img.shields.io/badge/Maintenance-Active-brightgreen?style=flat-square" alt="Maintenance status: active" />
  <img src="https://img.shields.io/github/last-commit/ProjectMambo/MamboWiki?style=flat-square&color=7a5fff" alt="Last commit" />
  <img src="https://img.shields.io/github/repo-size/ProjectMambo/MamboWiki?style=flat-square&color=yellow" alt="Repository size" />
  <a href="LICENSE"><img src="https://img.shields.io/github/license/ProjectMambo/MamboWiki?style=flat-square&color=orange" alt="License" /></a>
</p>

MamboWiki is the documentation site for the eleven Project Mambo repositories. It assembles the same canonical project documentation exported to each repository, mounts every project at a stable route, and renders the result through MamboSite as a static Next.js site.

## Motivation

Project Mambo needs one public, navigable home for the canonical documentation that already belongs to each repository. MamboWiki assembles those sources without creating a second authoring copy and publishes a static artifact with stable project routes.

### Start here

| Goal | Link |
|---|---|
| Read the canonical Wiki documentation | [projectmambo.org/mambowiki/](https://projectmambo.org/mambowiki/) |
| Review the synchronized site entry | [docs/index.md](docs/index.md) |
| Synchronize canonical content | [Content workflow](docs/_mounts/mambowiki/Content%20Workflow.md) |
| Validate and deploy the site | [Build and deployment](docs/_mounts/mambowiki/Build%20and%20Deployment.md) |
| Inspect route and build configuration | [mambo.toml](mambo.toml) |
| Inspect the static deployment workflow | [.github/workflows/nextjs.yml](.github/workflows/nextjs.yml) |
| Understand MamboSite | [ProjectMambo/MamboSite](https://github.com/ProjectMambo/MamboSite) |
| Visit the target domain | [projectmambo.org](https://projectmambo.org) |

## Status

MamboWiki currently publishes all eleven Project Mambo documentation sets through MamboSite and GitHub Pages. Its committed content is a synchronized snapshot; the Next.js shell remains deliberately thin, and no server runtime is required.

### Information architecture

| Route | Source |
|---|---|
| `/` | Wiki-owned ecosystem landing page |
| `/mambocolour/` | Canonical MamboColour documentation |
| `/mambodocs/` | Canonical MamboDocs standards |
| `/mambodot/` | Canonical MamboDot documentation |
| `/mambofinance/` | Canonical MamboFinance documentation |
| `/mambofolio/` | Canonical MamboFolio documentation |
| `/mambofont/` | Canonical MamboFont documentation |
| `/mambomeme/` | Canonical MamboMeme documentation |
| `/mambosite/` | Canonical MamboSite documentation |
| `/mambotools/` | Canonical MamboTools documentation |
| `/mamboui/` | Canonical MamboUI documentation |
| `/mambowiki/` | Canonical MamboWiki documentation |

The root page declares these mounts explicitly. `sync_docs.js` materializes each source beneath the generated `docs/_mounts/` namespace and rewrites the exported mount paths; MamboSite publishes them only at their configured public routes.

### Architecture

```text
canonical vault project docs + Wiki site entry
    -> sync_docs.js
    -> README.md + docs/index.md + docs/_mounts/
    -> MamboSite Rust compiler
    -> generated TypeScript + MamboColour-backed theme CSS
    -> MamboSite-packaged MamboFont web fonts
    -> MamboSite React runtime and default theme
    -> Next.js static export in out/
    -> GitHub Pages
```

MamboWiki owns the site entry, `mambo.toml`, its thin Next.js shell, package lock, workflow, and synchronized content snapshot. MamboSite owns parsing, validation, route assembly, shared React components, theme behavior, and the framework adapter.

## User stories

- As a reader, I can browse every Project Mambo project's canonical documentation at a stable route.
- As a project maintainer, I can author a guide once and synchronize it to both the owning repository and the Wiki.
- As a Wiki maintainer, I can validate all mounts, source checks, documentation standards, and the static artifact through one command.

## Getting started

### Prerequisites

- Node.js 20 or later and npm.
- Rust 1.95.0 or later.
- Git and sibling checkouts of MamboSite and MamboDocs at the pinned revisions below.
- Python 3 only for the optional static preview command.

Clone the repositories beside each other, select the validated provider revisions, build MamboSite, install its command wrapper, then install MamboWiki:

```bash
git clone https://github.com/ProjectMambo/MamboSite.git
git clone https://github.com/ProjectMambo/MamboWiki.git
git clone https://github.com/ProjectMambo/MamboDocs.git
git -C MamboSite checkout 43f861f6f4a0f1504753faf4b6113e2e75636f59
git -C MamboDocs checkout 95e29a78e7e77e3dae6a6c8c410020351c4e0b6c
cd MamboSite
npm ci
npm run build:packages
./script/install.sh
cd ../MamboWiki
npm ci
npm run content:check
npm run dev
```

## Usage

| Command | Purpose |
|---|---|
| `npm run runtime:build` | Build the sibling MamboSite web packages. |
| `npm run content:check` | Validate all physical and mounted Markdown without writing output. |
| `npm run content:build` | Generate content, theme data, and managed assets without running Next.js. |
| `npm run check` | Run the complete content, documentation, source, and reproducible-build gate. |
| `npm run dev` | Regenerate content and start the local Next.js development server. |
| `npm run build` | Run the complete MamboSite and Next.js static build into `out/`. |
| `npm run preview` | Serve `out/` at `http://127.0.0.1:4173`. |
| `npm run lint` | Run ESLint. |
| `npm run typecheck` | Run TypeScript without emitting files. |
| `npm run deploy` | Build, push committed work when needed, and trigger GitHub Pages. |

## Documentation

Project docs are authored in the Project Mambo Obsidian vault, not directly in this repository's generated `docs/` snapshot. From the vault root:

```bash
node Scripts/sync_docs.js --sync MamboWiki
```

Because MamboWiki mounts every project, run its sync after changing any canonical project documentation. Review the complete replacement, validate, build, and commit it before deployment. See MamboSite's Documentation Sync guide for the cross-repository workflow.

The mounted [MamboWiki guide](https://projectmambo.org/mambowiki/) documents architecture, synchronization, validation, and deployment. Report incorrect project content to its owning repository; keep Wiki-specific assembly and deployment guidance here.

## Project structure

```text
docs/index.md          synchronized Wiki landing page
docs/_mounts/          committed snapshots of all canonical project docs
src/app/               thin Next.js root and catch-all route shell
mambo.toml             mount, renderer, URL, and deploy configuration
.github/workflows/     pinned validation and GitHub Pages pipeline
out/                   ignored static export produced by a build
```

## Validation

Run the single local gate before committing or deploying:

```bash
npm run check
git status --short
```

The check validates the complete mounted graph and strict MamboDocs repository contract, runs ESLint and TypeScript, performs a reproducible static build with `SOURCE_DATE_EPOCH=0`, confirms `out/index.html`, and checks the diff for whitespace errors. It requires the pinned sibling MamboSite and MamboDocs checkouts from Getting started.

Serve `out/` and inspect the home page, every project root, representative deep pages, internal links, assets, and the not-found page at narrow and wide viewports. Review keyboard-only navigation, visible focus, heading order, contrast, and reduced-motion behavior. The static Wiki has no analytics, forms, accounts, cookies, or user-data collection; verify that synchronized content contains no private vault material, and document the privacy boundary before adding any data collection.

## Development

Author project documentation in the canonical vault, keep route assembly declarative, and leave shared rendering behavior in MamboSite. Next.js 16 does not run linting as part of `next build`, so keep the explicit lint and type-check stages in `npm run check`.

### Deployment

The committed workflow checks out MamboWiki, the pinned MamboSite revision, and the pinned MamboDocs checker; installs both npm dependency trees; runs `npm run check`; rebuilds once without the fixed validation epoch; uploads `out/`; and deploys it to GitHub Pages.

`npm run deploy` requires a clean `main` branch. It pushes when local commits are ahead or dispatches the configured workflow when the current commit is already remote. Preview that decision without external changes:

```bash
npm run deploy -- --dry-run
```

The production footer formats the CI build instant in `Asia/Singapore`. Local reproducibility checks set `SOURCE_DATE_EPOCH=0`, which fixes both that timestamp and the generated collection-accent order.

### Post-deploy verification and rollback

After the Actions and Pages jobs succeed, open [projectmambo.org](https://projectmambo.org) in a fresh browser session and verify the landing page, two mounted project roots, a deep guide, assets, navigation, and the not-found page. Confirm the footer reports the expected deployment time and repeat the keyboard and responsive smoke checks on the live artifact.

If the release is faulty, create a normal `git revert <bad-commit>` on `main`, run `npm run check`, and deploy that revert. Revert the consumer commit that changed a bad MamboSite pin or lockfile rather than moving the pinned provider revision in place; do not rewrite published branch history.

### Generated and retained files

`src/generated/mambo/`, `public/mambo/`, `.next/`, and `out/` are build output and remain untracked. `docs/_mounts/` and the branding sources under `docs/_assets/` are synchronized and committed so the repository and CI receive one self-contained snapshot. MamboSite publishes the icon and social preview under `public/mambo/assets/`; the root `public/` copies remain compatibility mirrors. MamboFont is bundled by the pinned MamboSite default-theme package.

`CNAME` is retained while the custom domain remains configured in GitHub Pages, even though the custom Actions artifact does not depend on that file.

## Issues and feedback

This is Project Mambo's documentation site, so external pull requests are not currently requested. Report incorrect project content to the repository that owns it; report wiki assembly or rendering issues here.

## License

Distributed under the MIT License. See **[LICENSE](LICENSE)** for details.
