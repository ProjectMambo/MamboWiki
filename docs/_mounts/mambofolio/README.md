# MamboFolio

<p align="left">
  <img src="https://img.shields.io/badge/GitHub_Pages-222222?style=flat-square&logo=githubpages&logoColor=white" alt="GitHub Pages" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/MamboSite-000000?style=flat-square&logoColor=white" alt="MamboSite" />
  <img src="https://img.shields.io/badge/Deploy-Live-brightgreen?style=flat-square" alt="Deploy Status" />
</p>
<p align="left">
  <img src="https://img.shields.io/badge/Maintenance-Active-brightgreen?style=flat-square" alt="Maintenance status: active" />
  <img src="https://img.shields.io/github/last-commit/ProjectMambo/MamboFolio?style=flat-square&color=7a5fff" alt="Last commit" />
  <img src="https://img.shields.io/github/repo-size/ProjectMambo/MamboFolio?style=flat-square&color=yellow" alt="Repository size" />
  <a href="LICENSE"><img src="https://img.shields.io/github/license/ProjectMambo/MamboFolio?style=flat-square&color=orange" alt="License" /></a>
</p>

MamboFolio is Solomon Koh's live, Markdown-first portfolio. Repository-local Markdown is compiled by MamboSite, rendered through its shared React and Next.js runtime, and exported as a static GitHub Pages site.

## Start here

| Goal | Link |
|---|---|
| Read the canonical Wiki documentation | [projectmambo.org/mambofolio/](https://projectmambo.org/mambofolio/) |
| Visit the portfolio | [kohkohnut.org](https://kohkohnut.org) |
| Browse the published content snapshot | [docs/index.md](docs/index.md) |
| Inspect site configuration | [mambo.toml](mambo.toml) |
| Inspect design tokens | [mambo.theme.toml](mambo.theme.toml) |
| Review the deployment pipeline | [.github/workflows/nextjs.yml](.github/workflows/nextjs.yml) |
| Understand the platform | [ProjectMambo/MamboSite](https://github.com/ProjectMambo/MamboSite) |

## Current status

The MamboSite migration is complete and the former handwritten portfolio implementation has been removed. The current repository keeps a thin Next.js shell around MamboSite's compiler, runtime, default components, and theme contract. The live site includes profile, current-work, university, project, blog, and gallery pages sourced from Markdown.

MamboFolio currently consumes the four MamboSite web packages from a sibling `MamboSite` checkout. Its production workflow pins the matching MamboSite compiler commit, Rust 1.95.0, Node.js 20, and both npm lockfiles.

## Architecture

```text
canonical vault content
    -> sync_docs.js
    -> repository docs/
    -> MamboSite Rust compiler
    -> generated TypeScript + theme/content assets
    -> MamboSite React runtime + default theme
    -> Next.js static export in out/
    -> GitHub Pages
```

MamboFolio owns its content snapshot, `mambo.toml`, `mambo.theme.toml`, synchronized branding sources under `docs/_assets/`, and the thin files under `src/app/`. MamboSite owns Markdown parsing, validation, generated data, rendering components, and the Next.js adapter. Generated `src/generated/mambo/` and `public/mambo/` trees are rebuilt locally and in CI rather than committed.

## Local setup

### Prerequisites

- Node.js 20 or later and npm.
- Rust 1.95.0 or later.
- Git and a sibling checkout of MamboSite.
- Python 3 only for the optional static preview command.

Clone both repositories beside each other, build MamboSite, install its `mbsite` command, then install MamboFolio:

```bash
git clone https://github.com/ProjectMambo/MamboSite.git
git clone https://github.com/ProjectMambo/MamboFolio.git
cd MamboSite
npm ci
npm run build:packages
./script/install.sh
cd ../MamboFolio
npm ci
npm run content:check
npm run dev
```

`npm run dev` rebuilds the sibling MamboSite packages and the generated content before starting Next.js.

## Commands

| Command | Purpose |
|---|---|
| `npm run runtime:build` | Build the sibling MamboSite web packages. |
| `npm run content:check` | Validate the complete Markdown site without writing generated output. |
| `npm run content:build` | Regenerate compiled content, theme data, and managed assets without running Next.js. |
| `npm run dev` | Regenerate content and start the local Next.js development server. |
| `npm run build` | Run the complete MamboSite and Next.js static build into `out/`. |
| `npm run preview` | Serve the completed `out/` directory at `http://127.0.0.1:4173`. |
| `npm run lint` | Run ESLint. |
| `npm run typecheck` | Run TypeScript without emitting files. |
| `npm run deploy` | Build, push committed work when needed, and trigger GitHub Pages. |

## Canonical content and synchronization

Project Mambo authors documentation centrally in its Obsidian vault. The project README and mounted wiki page live under `Docs/Projects/MamboFolio/`; portfolio-owned pages and media live under `Docs/Projects/_sites/MamboFolio/`.

From the vault root, refresh only this repository with:

```bash
node Scripts/sync_docs.js --sync MamboFolio
```

The sync replaces MamboFolio's complete repository `docs/` snapshot and root `README.md`. It does not change the application shell, configuration, workflow, or other source files. Edit the canonical vault copies rather than synchronized repository docs, then inspect the diff and run the content and build checks before committing.

## Deployment

Pushing `main` starts the GitHub Pages workflow. CI checks out MamboFolio and the pinned MamboSite revision, installs both dependency trees, runs one complete MamboSite build, uploads `MamboFolio/out`, and deploys it to [kohkohnut.org](https://kohkohnut.org).

`npm run deploy` requires a clean deployment branch and never creates a commit. It pushes committed work when the branch is ahead; when the current commit is already remote, it dispatches the configured Pages workflow again. Preview that decision without pushing or dispatching with:

```bash
npm run deploy -- --dry-run
```

## Validation

Before committing or deploying, run the complete local gate:

```bash
npm run content:check
npm run lint
npm run typecheck
SOURCE_DATE_EPOCH=0 npm run build
git diff --check
git status --short
```

## Issues and feedback

This is a personal portfolio, so external pull requests are not currently requested. If you find a bug or rendering issue, opening an issue is welcome.

## License

Distributed under the MIT License. See **[LICENSE](LICENSE)** for details.
