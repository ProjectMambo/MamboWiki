---
description: The MamboSite-powered documentation website for the Project Mambo ecosystem.
title: MamboWiki
order: 80
data:
  period: August 2026 - Present
  wikiUrl: https://projectmambo.org
  githubUrl: https://github.com/ProjectMambo/MamboWiki
---

::page{layout="project" width="normal" sidebar=true}

# MamboWiki

::meta{show=["period","description","wikiUrl","githubUrl"] style="stack" empty="hide"}

MamboWiki assembles the eight Project Mambo documentation trees into one static website. It uses explicit MamboSite mounts so each repository keeps one canonical set of docs while the Wiki publishes the same snapshot at a stable route.

## Responsibilities

- Own the ecosystem landing page and the mount map.
- Receive materialized project documentation from `sync_docs.js`.
- Validate cross-project routes, links, Markdown, and directives with MamboSite.
- Build a static Next.js export for GitHub Pages.
- Publish the validated static artifact through the configured GitHub Pages workflow.

## Documentation

::children{view="list" sort="order" direction="asc" show=["title","description"]}

## Links

::button{label="Visit projectmambo.org" href="https://projectmambo.org" variant="primary" external=true}

::button{label="View source on GitHub" href="https://github.com/ProjectMambo/MamboWiki" variant="secondary" external=true}

## Current status

The MamboSite-backed implementation and eight mounted project trees build and export locally and through the GitHub Pages workflow. The site inherits MamboSite's packaged MamboColour and MamboFont theme.
