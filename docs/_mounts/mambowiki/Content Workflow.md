---
title: MamboWiki content workflow
description: Author canonical project documentation, synchronize the Wiki snapshot, review it, and prepare a safe commit.
order: 20
---

::page{layout="docs" width="normal" sidebar=true}

# MamboWiki content workflow

## 1. Edit the canonical source

Project documentation belongs under `Docs/Projects/<Project>/` in the Project Mambo vault. The Wiki landing page and mount declarations belong under `Docs/Projects/_sites/MamboWiki/`.

Do not hand-edit `MamboWiki/docs/_mounts/`. The next synchronization replaces the complete `docs/` directory.

Each routed page should have a clear `title`, one-sentence `description`, and stable `order` when it appears in a collection. A project `index.md` is its Wiki hub. `README.md` is copied for GitHub and remains non-routable.

## 2. Synchronize

From the vault root:

```bash
node Scripts/sync_docs.js --sync MamboWiki
```

Run the Wiki sync after changing **any** mounted project's documentation. To update both an owning repository and the Wiki copy in one invocation, list both names:

```bash
node Scripts/sync_docs.js --sync MamboDot MamboWiki
```

A full synchronization updates every repository and the organisation profile:

```bash
node Scripts/sync_docs.js --sync-all
```

## 3. Review the replacement

```bash
git -C "$HOME/ProjectMambo/MamboWiki" status --short
git -C "$HOME/ProjectMambo/MamboWiki" diff -- README.md docs/
```

Expected structural changes include the Wiki-owned `docs/index.md`, the complete `docs/_mounts/` snapshot, and removal of legacy copied folders outside that namespace. Unexpected changes to site source or configuration are not produced by the sync script.

## 4. Validate and build

From the MamboWiki repository:

```bash
npm run content:check
npm run lint
npm run typecheck
SOURCE_DATE_EPOCH=0 npm run build
test -f out/index.html
git diff --check
git status --short
```

The fixed epoch makes both the visible footer timestamp and shuffled collection accents reproducible during review; production deployment uses its actual build time.

Review the home page, every mounted project root, representative child pages, a deep MamboSite guide, internal links, and the not-found page before approving deployment.

## 5. Commit the synchronized snapshot

Keep synchronized content separate from site-shell or workflow changes:

```bash
git add -- README.md docs/
git diff --cached --check
git diff --cached
git commit -m "docs: refresh Project Mambo knowledge base"
```

No diff requires no commit. Do not use an empty commit to trigger deployment.

## 6. Deploy

From a clean `main` branch, use the deployment flow in [[Build and Deployment#Deploy]]. MamboSite's [[Documentation Sync#After every sync|post-sync guide]] remains the source for the complete cross-repository policy.
