---
description: Documentation for Project Mambo's software, sites, design assets, and workstation configuration.
title: Project Mambo
mounts:
  - path: /mambocolour
    source: "_mounts/mambocolour/index.md"
  - path: /mambodot
    source: "_mounts/mambodot/index.md"
  - path: /mambofinance
    source: "_mounts/mambofinance/index.md"
  - path: /mambofolio
    source: "_mounts/mambofolio/index.md"
  - path: /mambofont
    source: "_mounts/mambofont/index.md"
  - path: /mambosite
    source: "_mounts/mambosite/index.md"
  - path: /mambowiki
    source: "_mounts/mambowiki/index.md"
data:
  navigation:
    - label: PROJECT MAMBO
      href: /
    - label: PORTFOLIO
      href: https://kohkohnut.org
    - label: GITHUB
      href: https://github.com/ProjectMambo
  hero:
    quote: Build the system. Document the source.
    attribution: Project Mambo
  footer:
    copyright: 2026 Project Mambo. Built with MamboSite and Next.js.
    links:
      - label: Wiki Source
        href: https://github.com/ProjectMambo/MamboWiki
      - label: MamboSite
        href: /mambosite/
---

::page{layout="home" width="wide" sidebar=false}

::hero{align="left" show-description=true}

Project Mambo is a personal software and design ecosystem spanning an Arch Linux desktop, shared colours and fonts, a finance ledger, a static-site platform, a portfolio, and this documentation Wiki.

## Projects

Each card opens the canonical documentation maintained by its repository.

::children{view="grid" columns=3 depth=1 sort="order" direction="asc" show=["title","description"]}

## How this Wiki works

Project documentation is authored once in the Project Mambo vault, synchronized into each repository, and mounted here as a self-contained snapshot. MamboSite validates the complete graph and renders it as a static Next.js site.

::button{label="Read the MamboWiki guide" href="/mambowiki/" variant="secondary"}

::button{label="Explore MamboSite" href="/mambosite/" variant="secondary"}
