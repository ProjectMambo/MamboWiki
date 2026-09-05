---
title: MamboWiki Architecture
description: Source ownership, mount assembly, routes, rendering shell, and generated-file boundaries.
order: 10
---

::page{layout="docs" width="normal" sidebar=true}

# MamboWiki Architecture

## Source ownership

MamboWiki separates authored knowledge from the website shell:

```text
Obsidian vault
├── Docs/Projects/<Project>/          canonical project docs
└── Docs/Projects/_sites/MamboWiki/   Wiki-owned entry and layout content

MamboWiki repository
├── docs/                              synchronized snapshot
├── src/app/                           thin Next.js route shell
├── src/mambo/                         MamboSite runtime assembly
├── mambo.toml                         content, URL, renderer, deploy config
└── .github/workflows/                 static Pages pipeline
```

Edit the vault copies for documentation. Edit the repository only for the site shell, build configuration, dependency wiring, or deployment workflow.

## Mount assembly

Only the Wiki site entry may declare mounts. Its vault-facing sources are Obsidian references to canonical project `index.md` files. During sync, each containing project directory is copied into `docs/_mounts/<project>/`, and only the exported entry is rewritten to those repository-local paths.

MamboSite excludes `_mounts/` from normal discovery. The explicit mount declaration makes each copied tree public at its configured path, preventing storage routes and duplicate pages.

| Public route | Materialized source |
|---|---|
| `/mambocolour/` | `_mounts/mambocolour/index.md` |
| `/mambodot/` | `_mounts/mambodot/index.md` |
| `/mambofinance/` | `_mounts/mambofinance/index.md` |
| `/mambofolio/` | `_mounts/mambofolio/index.md` |
| `/mambofont/` | `_mounts/mambofont/index.md` |
| `/mambosite/` | `_mounts/mambosite/index.md` |
| `/mambowiki/` | `_mounts/mambowiki/index.md` |

The final mount is not recursive: the Wiki's site entry and its canonical project entry are different source files.

## Compilation and rendering

MamboSite first parses, resolves, and validates the complete mounted content graph. It writes typed page and manifest modules under `src/generated/mambo/` and theme/content assets under `public/mambo/`.

The repository's route shell contains one root page and one catch-all page. The root renders the configured entry; the catch-all generates every known non-root route at build time and rejects unknown paths. `MamboSiteFrame`, the default component registry, page metadata, theme bootstrap, and not-found presentation come from the sibling MamboSite packages. The site-owned `public/og.png` supplies the root Open Graph and X preview; documentation pages publish their own title and description without inheriting that generic image.

Next.js runs with static export, an empty base path for the custom domain, trailing slashes, and unoptimized images. The complete production artifact is `out/`.

## Theme

MamboWiki initially uses MamboSite's built-in default theme. No copied theme or font bundle is needed to render the documentation. Add a small `mambo.theme.toml` only when the Wiki needs deliberate token overrides; do not fork the shared component implementation for cosmetic changes.

## Generated-file policy

Commit the synchronized `README.md` and `docs/` tree. Do not commit build outputs:

- `src/generated/mambo/`
- `public/mambo/`
- `.next/`
- `out/`
- `*.tsbuildinfo`

CI regenerates all of them from the committed content snapshot and pinned dependencies.

## Dependency boundary

Until MamboSite packages are published, local development uses `file:../MamboSite/packages/...` dependencies and CI checks out MamboSite at an exact commit. The compiler and four web packages must remain compatible; update the workflow pin and lockfile deliberately when upgrading.
