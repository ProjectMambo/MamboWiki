---
description: Content-led maintenance, provider upgrades, deployment gates, and rollback for MamboFolio.
title: Development plan
order: 15
---

::page{layout="docs" width="normal" sidebar=true}

# Development plan

MamboFolio is a live, stable portfolio rather than a feature roadmap. Development follows real changes in Solomon's work, studies, writing, projects, and public profile: add one truthful content slice when it exists, validate the complete site, then deploy it safely.

This plan is dependency-ordered but not date-driven. Update it when content ownership, the MamboSite provider contract, the privacy boundary, deployment behavior, or rollback path changes.

## Current state

The MamboSite migration is complete. Canonical portfolio Markdown and media live under `notes/Docs/Projects/_sites/MamboFolio/`; canonical project documentation lives under `notes/Docs/Projects/MamboFolio/`. The synchronization script replaces the repository `docs/` snapshot, MamboSite validates and compiles it, a thin Next.js shell creates a static export, and GitHub Pages serves the result at `kohkohnut.org`.

MamboFolio owns its public content, configuration, theme values, branding assets, and deployment workflow. MamboSite owns the compiler, generated content contract, React runtime, default components, and Next.js adapter. The repository currently pins sibling MamboSite packages and a reviewed compiler commit because compatible packages are not yet published.

The site has no analytics, forms, cookies, accounts, server-side runtime, or user-data collection. Current evidence consists of the canonical vault content, synchronized repository snapshot, `npm run check`, static output, GitHub Pages workflow, and live-site smoke checks.

## Target maintenance state

Keep the portfolio accurate, readable, accessible, private by default, and reproducibly deployable. Each content increment should move from one canonical edit to one reviewed repository commit and one verified live artifact without changing shared rendering code.

There is no fixed content calendar or speculative feature milestone. New content is added as real work, study, writing, media, or profile information becomes ready for public presentation.

## Scope, ownership, and deferrals

In scope are portfolio content and media, factual corrections, navigation and metadata owned by this site, accessibility fixes, deliberate MamboSite upgrades, dependency and workflow maintenance, deployment, live verification, and recovery.

| Boundary | Owner and rule |
|---|---|
| Canonical portfolio content and media | The notes vault; repository `docs/` is a replaceable synchronized snapshot. |
| Site configuration, theme values, and thin application shell | MamboFolio; add site-specific behavior only when the shared provider cannot own it. |
| Markdown compilation, directives, generated data, rendering, and shared components | MamboSite; deliver provider changes before updating MamboFolio's pin or lockfile. |
| Static hosting and custom domain | GitHub Pages and the repository workflow; deployment uses committed clean `main`. |
| Personal information and media | Solomon; publish only information intentionally selected for the public portfolio. |

Deferred work includes analytics, forms, comments, cookies, search, accounts, a CMS, a server runtime, client-side content fetching, a second renderer, and a site-local component system. Add data collection only after a written privacy purpose, retention boundary, consent behavior, and removal path exist. Remove the sibling-package exception only when compatible MamboSite packages are published and a clean consumer migration passes.

## Stage 0: Preserve the publication contract

Keep canonical ownership, complete-replacement synchronization, strict links and frontmatter, provider pins, static export, custom-domain configuration, and the no-data-collection boundary explicit. Review personal details and media before they enter the canonical site tree; never place credentials, private drafts, source-only notes, or unlicensed media in the public snapshot.

Exit gate: ownership and provider pins are documented, the current live site can be rebuilt from a clean checkout, and no known content, privacy, accessibility, or deployment defect requires action.

## Stage 1: Author one coherent content increment

Add or revise the smallest complete public story in the canonical `_sites/MamboFolio/` tree. Update its `updated` metadata, links, descriptions, navigation, and media together. Keep planned or incomplete work out of current capability claims, and remove stale facts instead of preserving them for history in the live portfolio.

For media, verify ownership, intended public visibility, useful alternative text or captioning, and reasonable dimensions. For personal details, publish only what is necessary for the page's purpose.

Exit gate: the canonical diff tells one reviewable story, every referenced asset and link exists, the content is intentionally public, and no unrelated vault page is included.

## Stage 2: Synchronize and validate

Run the targeted canonical export for MamboFolio and MamboWiki. Review every generated addition, change, and deletion because synchronization replaces complete owned trees. Keep authored content changes separate in the commit message when they are distinct from plan or provider maintenance.

Run `npm run content:check` while iterating and `npm run check` before delivery. The full gate validates the MamboDocs contract, builds provider packages and generated content, runs lint and type checking, creates two reproducible static exports, checks `out/index.html`, and rejects whitespace errors. Preview the output and inspect the home page, changed route, representative project or article, media, navigation, deep links, not-found page, narrow and wide layouts, keyboard focus, contrast, and reduced motion.

Exit gate: the synchronized snapshot contains only intended canonical changes, the complete gate passes from the documented provider revisions, and the reviewed static artifact renders every affected journey without an accessibility or privacy regression.

## Stage 3: Deploy and verify

Commit the validated increment with a Conventional Commit, bring clean local `main` up to date without rewriting history, and run the repository deployment command. The deploy path builds again, pushes an ahead `main` commit or dispatches the configured workflow when the commit is already remote, and lets GitHub Pages publish the static artifact.

After Actions and Pages succeed, verify `kohkohnut.org` in a fresh session: home, the changed route, one nested route, media, navigation, not-found behavior, narrow and wide layouts, and keyboard focus. Confirm the footer identifies the expected build.

If verification fails, create a normal revert of the faulty consumer commit, run the full gate, and deploy the revert. Do not force-push published history or move a provider pin without a reviewed consumer commit.

Exit gate: GitHub Pages serves the intended commit at the custom domain, live checks match the validated artifact, and the previous good commit remains recoverable through an ordinary revert.

## Triggered provider maintenance

Begin a provider upgrade only for a required fix, compatible released packages, or a MamboSite contract that the portfolio needs. Validate MamboSite first, then update the exact compiler revision, package dependencies, both lockfiles, documentation, and MamboFolio artifact in one consumer phase. Do not combine a provider migration with unrelated portfolio content.

Exit gate: the provider and consumer gates pass from clean checkouts, the live portfolio has no route or visual regression, the compatibility decision is documented, and reverting the consumer commit restores the prior provider set without content migration.

## Validation, milestones, and risks

The complete local gate is:

```bash
npm run check
git status --short
```

Meaningful milestones are a published content increment, a provider maintenance release, recovery from a faulty deployment, or eventual retirement. Content continues as real material becomes available; the plan does not invent a percentage-complete portfolio.

The main risks are complete-replacement sync deleting an unintended snapshot file, unversioned canonical vault edits, accidental publication of personal information, media-rights mistakes, stale facts or links, provider drift, and a deployment whose live artifact differs from local evidence. Targeted sync, complete diff review, privacy review, exact provider pins, the full gate, live verification, and revert-based rollback are the controls.
