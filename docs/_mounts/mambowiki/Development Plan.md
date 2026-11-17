---
title: Development plan
description: Dependency-ordered maintenance stages for MamboWiki content synchronization, provider upgrades, validation, deployment, and rollback.
order: 15
---

::page{layout="docs" width="normal" sidebar=true}

# Development plan

MamboWiki is an active static documentation site. It already publishes Project Mambo's canonical project trees through MamboSite and GitHub Pages; its continuing development is maintenance of source ownership, mount compatibility, validation, accessibility, deployment, and recovery rather than application feature growth.

## Target state and boundaries

The Wiki must materialize each registered canonical documentation tree once, expose every route through the configured mount graph, build a reproducible static artifact through pinned MamboSite and MamboDocs providers, and deploy or roll back without inventing a second content source.

MamboWiki owns the root landing page, mount configuration, thin Next.js shell, provider pins, package lock, validation command, deployment workflow, and committed synchronized snapshot. Canonical project content remains owned by each project, while parsing, route assembly, shared components, and theme behavior remain owned by MamboSite.

The site does not add accounts, analytics, forms, cookies, server rendering, a content database, or an independent editor unless a documented product need changes the privacy and operational boundary.

## Stage 1: Synchronize canonical content

Apply project documentation changes in their canonical notes source, run the targeted sync for the owning repository and MamboWiki, and review every generated addition, modification, deletion, mount rewrite, and metadata change. Never edit a materialized mount as the source.

Exit gate: the owning repository and Wiki snapshot match the canonical source, every routed child is reachable once, and no private vault metadata or unrelated project content appears in the export.

## Stage 2: Upgrade providers deliberately

Upgrade MamboSite, MamboDocs, Next.js, or another direct provider only from a reviewed revision. Update exact pins, package manifests or lockfiles, workflow checkouts, compatibility documentation, and generated expectations together. Build MamboSite before validating a consumer change when its compiler or web packages change.

Exit gate: clean-clone setup resolves the pinned providers, the strict documentation contract passes, and no generated route, directive, component, theme, or asset contract regresses.

## Stage 3: Validate content and presentation

Run the single repository gate to validate the complete mount graph, links, Markdown, directives, strict MamboDocs contract, generated modules, lint, types, deterministic build, and static export. Inspect representative project roots and deep pages at narrow and wide viewports with keyboard navigation, visible focus, heading order, contrast, and reduced motion.

Exit gate: npm run check succeeds from the documented starting state, out/index.html exists, repeated fixed-epoch builds are reproducible, and the rendered smoke review finds no inaccessible or broken route.

## Stage 4: Deploy and verify

Deploy only a clean main commit through the documented workflow. Verify the landing page, representative mounts, a deep guide, assets, navigation, not-found route, and build timestamp in a fresh browser session. Keep the static site free of runtime secrets and user-data collection.

Exit gate: GitHub Pages serves the intended commit at the custom domain and the live smoke checks match the validated local artifact.

## Stage 5: Recover or retire

For a faulty publication, create a normal revert of the consumer commit, repeat the complete gate, and deploy the revert. Revert a bad provider-pin change instead of moving history or silently selecting another dependency revision. Preserve CNAME and route compatibility while the custom domain remains supported.

Exit gate: the last known-good static artifact is live, the faulty commit remains visible in history, and follow-up work records the actual provider, content, or deployment cause.

## Validation, risks, and triggers

The complete gate is npm run check followed by a clean-status review. The main risks are canonical and generated content drifting, provider pins becoming incompatible, a mount exposing unintended material, and a static build passing while keyboard or responsive behavior regresses.

Add new runtime or content infrastructure only when the static synchronized model cannot satisfy an observed requirement. Any analytics, forms, search service, accounts, or server runtime requires a new privacy, security, operations, data-retention, and rollback stage before implementation.
