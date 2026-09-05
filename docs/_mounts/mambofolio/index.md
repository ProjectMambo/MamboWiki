---
description: Solomon Koh's Markdown-first portfolio, built with MamboSite and deployed as a static website.
title: MamboFolio
order: 50
tags:
  - web/GitHub Pages
  - web/MamboSite
  - web/Next.js
data:
  period: May 2026 - Present
  wikiUrl: https://kohkohnut.org
  githubUrl: https://github.com/ProjectMambo/MamboFolio
---

::page{layout="project" width="normal"}

# MamboFolio

::meta{show=["period","description","tags","wikiUrl","githubUrl"] style="stack" empty="hide"}

MamboFolio is the personal portfolio for Solomon Koh and Project Mambo. It publishes profile, current-work, university, project, blog, and gallery content from a repository-local Markdown snapshot.

## How it works

Project Mambo's documentation sync exports the canonical portfolio pages and media from the Obsidian vault into MamboFolio's `docs/` tree. [MamboSite](/mambosite/) then validates and compiles that tree, generates typed site data and assets, and drives a thin Next.js static export deployed through GitHub Pages.

The repository contains the site configuration and rendering shell; MamboSite supplies the shared compiler, React runtime, default component registry, and theme contract.

## Links

::button{label="Visit kohkohnut.org" href="https://kohkohnut.org" variant="primary" external=true}

::button{label="View source on GitHub" href="https://github.com/ProjectMambo/MamboFolio" variant="secondary" external=true}
