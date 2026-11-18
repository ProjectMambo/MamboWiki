---
title: Development plan
description: Dependency-ordered stages for replacing procedural glyph generation with human-drawn masters and delivering the complete base family.
order: 15
---

::page{layout="docs" width="normal" sidebar=true}

# Development plan

This plan delivers MamboFont as a human-drawn blocky monospace family with deterministic TTF and WOFF2 exports. It replaces procedural outline generation because the ASCII pilot proved that rules can enforce consistency but make optical correction slow and indirect. A font editor should own design work; repository automation should validate and package the result without redesigning it.

The plan is authoritative for delivery order, not a promise of calendar dates. Update it when implementation evidence changes the source format, visual rules, coverage, compatibility boundary, stage order, or release gate.

## Current state

The latest published and downstream-used family is MamboFont `0.2.4`. MamboSite remains pinned to its `MamboFont-<Style>_v0.2.4.woff2` files.

The unreleased `0.4.0` pilot currently has:

- a strict JSON geometry project and Python outline generator;
- Regular, Medium, SemiBold, and Bold pilot outputs with a 500-unit advance;
- 94 drawn ASCII glyphs plus 67 deliberate empty controls and spaces, for 161 encoded entries;
- a declared 283-entry target covering U+0000–U+00FF and the 27 defined printable Windows-1252 additions;
- deterministic TTF and WOFF2 export, structural checks, raster checks, and an HTML specimen;
- archived icon work that is outside the active base-font scope.

The pilot is useful as a visual reference and migration fixture, but its JSON syntax and procedural gap corrections are not the next authoring interface. No `0.4.0` font has been released, no downstream consumer uses it, and the planned custom browser editor has not been implemented.

## Target outcome

Four human-edited FontForge source files become the authoritative outlines:

~~~text
sources/MamboFont-Regular.sfd
sources/MamboFont-Medium.sfd
sources/MamboFont-SemiBold.sfd
sources/MamboFont-Bold.sfd
        |
        v
validate without changing contours
        |
        +--> deterministic TTF
        +--> deterministic WOFF2
        +--> review specimen
~~~

FontForge is already required, edits its native SFD format directly, and supplies the glyph canvas, guides, metrics, references, anchors, and multi-font comparison that a custom MamboFont editor would duplicate. The build may set the requested version and deterministic serialization metadata, but it must not synthesize, interpolate, thicken, simplify, repair, fill, or otherwise alter glyph contours. An invalid source fails with the affected font and glyph; the author fixes the SFD.

Each weight is an independent reviewed source. Regular and Bold may seed Medium and SemiBold once through an explicit FontForge interpolation experiment, but the results must be saved, manually corrected, and thereafter treated as independent masters. Normal builds never interpolate weights.

## Boundaries and deferrals

The next usable base-family release includes:

- Regular 400, Medium 500, SemiBold 600, and Bold 700;
- fixed 500-unit advances and shared vertical metrics;
- the complete 283-entry target, including 216 drawn glyphs and 67 intentional empty glyphs;
- square, blocky, straight-edged forms with no routine rounded-corner treatment;
- human-reviewed spacing, counters, apertures, joins, accents, and small-size behavior;
- deterministic TTF and WOFF2 artifacts plus an auditable specimen.

The following remain out of scope until evidence justifies them:

- Mambo Icons or any other icon family;
- a custom browser, native, Rust, or terminal font editor;
- procedural glyph geometry, machine-learned outlines, or build-time weight interpolation;
- a variable font;
- curves or rounded terminals as a general style feature;
- manual TrueType hinting below the 14-pixel review floor;
- automatic kerning for this fixed-width family;
- changing MamboSite or another consumer before a reviewed release candidate exists.

Reconsider a custom editor only if repeated FontForge work exposes a specific missing workflow that cannot be covered by guides, layers, scripts that inspect without modifying, or ordinary side-by-side review.

## Source and ownership contract

The active repository will own:

| Path or surface | Responsibility |
|---|---|
| `sources/MamboFont-<Style>.sfd` | Human-authored contours, components, anchors, widths, guides, and per-weight optical corrections |
| `sources/font.json` | Small machine-readable family metadata, weight-to-SFD mapping, required coverage, empty code points, and review sizes |
| `script/mbfont.py` | Read-only source validation, deterministic export, candidate comparison, and specimen generation |
| `tests/test_build.py` | Cmap, width, bounds, contour, metadata, determinism, and representative raster checks |
| `specimen.html` | Generated human-review surface, never an outline source |
| `archive/v0.4-json-prototype/` | Frozen procedural pilot, migration notes, and recovery reference |

The SFD files own design. JSON does not contain glyph vertices, rules, or generated shapes after cutover. The exporter does not save back into SFD sources. Generated TTF, WOFF2, SVG, and raster previews are derived artifacts.

## Visual contract

Human drawing does not remove the family rules. Every weight must retain:

- a 1000-unit em, 800-unit ascent, 200-unit descent, and 500-unit advance;
- flat horizontal and vertical terminals;
- square counters and right-angle outer corners where the glyph does not require a diagonal;
- true diagonals with level receiving ends, without staircase approximations, spikes, shelves, or accidental concave corners;
- recognizable distinctions for `I`, `l`, `1`, `O`, `0`, `S`, `5`, `B`, `8`, `m`, `n`, `w`, and `v`;
- enough counter, aperture, and notch space to remain readable at 14, 16, and 24 pixels, with 10 and 12 pixels treated only as stress tests;
- consistent stroke impression across punctuation, letters, figures, and accents without forcing every optical correction to an identical numeric thickness.

The archived `0.2.4` family and `0.4.0` pilot are references, not mandatory contour templates. Readability and a coherent family outweigh byte or point parity with either source.

## Stage 0: Freeze the procedural pilot and source decision

Record the current branch commit, command behavior, coverage, metrics, specimen, and deterministic output hashes. Add an archive note explaining why procedural geometry and the planned custom editor were superseded. Confirm FontForge SFD as the active human source format through one round-trip spike containing straight contours, a counter, a component, an anchor, an empty encoded glyph, and all required metadata.

Do not remove the JSON generator in this stage. The spike may live in a temporary directory and must not become a second permanent build path.

Exit gate: FontForge can open, edit, save, reopen, and export the spike without losing the tested contour, component, anchor, width, encoding, or metadata; the procedural baseline is reproducible and identified by commit.

## Stage 1: Cut over to human-editable sources

Generate the four current `0.4.0` pilot fonts once and import them into four SFD files as an editable baseline. These outlines are starting material, not approved designs.

In one atomic change:

- make the four SFD files the active outline sources;
- reduce `font.json` to metadata, weight mapping, coverage, empty glyphs, and review sizes;
- rewrite `compile`, `check`, and `specimen` to load SFD sources without modifying contours;
- preserve the existing command names and output selection where useful;
- archive the JSON glyph recipes, components, geometry evaluator, model, and JSON-specific tests under `archive/v0.4-json-prototype/`;
- cancel `mbfont edit` and remove its planned browser-editor architecture from active documentation;
- replace exact raster goldens that lock rejected shapes with structural checks and selected ambiguity checks.

The exporter must reject missing or extra encoded glyphs, wrong advances or line metrics, curves if the straight-outline contract remains active, invalid contour direction or intersections, out-of-bounds ink, non-empty control glyphs, inconsistent family metadata, and FontForge validation errors. It reports problems but does not repair them.

Exit gate: active code contains no glyph-construction or build-time interpolation path; all 161 current entries and four weights export from SFD with the same cmap, advances, empty glyphs, metrics, and deterministic file behavior as the frozen baseline; each source opens normally in FontForge.

## Stage 2: Redraw and approve printable ASCII

Redraw Regular and Bold first. Work by visual families rather than code-point order:

1. core stems and square counters;
2. identity-bearing diagonals;
3. lowercase shoulders and joins;
4. figures and ambiguous code characters;
5. punctuation and symbols.

Use FontForge guide and background layers for shared reference lines and archived comparisons. Remove unnecessary points at the source. Use components only where they improve editing without hiding a weight-specific optical correction.

After Regular and Bold establish the design, create or import Medium and SemiBold baselines. If one-time interpolation is used, inspect every glyph and save the corrected result as an independent source; do not preserve interpolation as a build dependency.

Review all four weights in text, repeated-glyph strings, code-like strings, punctuation rows, and ambiguity groups at large size and at 14, 16, and 24 pixels. A one-pixel raster difference alone is not sufficient when the forms are visually ambiguous.

Exit gate: all 94 visible ASCII glyphs are explicitly approved in all four weights; the 67 current empty glyphs remain contourless; no unresolved collision, popup, accidental hole, excess point, or cross-weight style mismatch remains; repeated deterministic exports pass.

## Stage 3: Complete Latin-1 and Windows-1252 coverage

Add the remaining 122 drawn glyphs to reach the 283-entry target. Build accents and shared marks as human-positioned SFD references where that preserves weight and alignment. Draw bespoke forms such as `Æ`, `Œ`, `Ð`, `Þ`, `ß`, currency signs, fractions, and punctuation directly when composition would create poor joins or counters.

Review precomposed accents at cap, x-height, ascender, and descender positions in every weight. Check that spacing accents and the same marks used in composites have a consistent visual weight. Keep U+0000–U+0020 and U+007F–U+00A0 contourless with 500-unit advances.

Exit gate: the cmap is exactly the declared 283 entries; all 216 drawn glyphs have reviewed outlines in every weight; all 67 empty glyphs have no contours; components resolve; accented and bespoke forms pass structural and visual review.

## Stage 4: Family quality and compatibility gate

Run the full source and artifact gate:

- FontForge source validation and reopen checks for every weight;
- exact cmap, width, metric, naming, licence, and monospace classification checks;
- no curves, self-intersections, invalid directions, accidental overlaps, or out-of-bounds contours under the approved straight-outline contract;
- point-economy review without shape-changing automatic simplification;
- browser specimens for every glyph and representative text at 14, 16, 24, and display sizes;
- ambiguity, repeated-glyph, punctuation, accent, and code-text review;
- `fontlint` and `fc-scan` on each TTF;
- two clean builds with byte-identical TTF and WOFF2 outputs;
- installation and rendering smoke tests in representative Project Mambo consumers.

If the family needs manual TrueType hinting to satisfy the 14-pixel floor, document that decision and add it as source work in this stage. Do not lower the floor or add automatic contour mutation to hide a failure.

Exit gate: every automated check passes, the complete specimen has human approval, and there are no unresolved base-font design or compatibility blockers.

## Stage 5: Usable release and downstream migration

Replace the temporary pilot family metadata with the final Mambo Font identity, choose the release version from actual compatibility impact, and commit reviewed TTF and WOFF2 artifacts. Write migration notes from `0.2.4`, including filenames, family naming, coverage, metrics, and consumer action.

Update providers before consumers. Publish MamboFont first, then update MamboSite and any other pinned consumer in separate reviewed changes. Keep old artifacts available for rollback until each consumer passes its own build and visual gate.

Icons remain archived and are not bundled into this release.

Exit gate: the tagged base-font release contains all four weights and 283 entries, clean installation and consumer journeys pass, downstream pins are updated deliberately, rollback inputs remain available, and repository plus Wiki documentation describe the released behavior rather than the pilot.

## Validation strategy

Automated checks protect objective contracts: coverage, empty glyphs, widths, metrics, bounds, contour validity, metadata, format validity, monospace classification, deterministic output, and selected raster distinctions. They must not encode every approved outline as a golden or automatically rewrite a source to make a test pass.

Human review owns optical quality. The acceptance specimen includes:

- the complete glyph set in every weight;
- `Il1|! O0Q B8& S5$ Z2 G6 g9q rn m vv w uvw cld pqbd`;
- punctuation, brackets, operators, accents, and repeated dense glyphs;
- prose and code-like samples;
- 14-, 16-, and 24-pixel rows plus large outline views.

Every stage runs its focused check before the complete repository gate. A failed source or artifact check blocks progression and names the exact weight and glyph where possible.

## Compatibility, preservation, and recovery

The `0.4.0` generator is unreleased, so replacing its authoring format does not require a user-data migration or downstream compatibility shim. Preserve it in the archive and Git history so a regression can be investigated without keeping two active compilers.

The released `0.2.4` files remain the downstream contract until Stage 5. Do not overwrite them, reuse their version, silently change their filenames, or move a consumer during source cutover. A failed human-source migration can return to the frozen pilot commit without affecting released artifacts.

SFD files are text but FontForge saves can produce broad diffs. Commit one coherent glyph family or weight pass at a time, review source and rendered output together, and never resolve an SFD conflict by choosing one whole side without visual inspection.

## Risks and evidence triggers

| Risk | Current response | Trigger for more work |
|---|---|---|
| Manual weights drift apart | Shared guides, paired Regular/Bold work, and four-weight specimens | Repeated mismatches may justify a review script, not build-time interpolation |
| SFD diffs are noisy | Small commits and rendered review | Proven review failures may justify a tested canonicalization tool that does not alter contours |
| FontForge source round-trips lose data | Stage 0 spike and reopen tests | Any loss blocks SFD adoption and reopens UFO evaluation |
| Small Bold counters close | Human optical correction and 14/16/24 review | Persistent failures may justify manual hinting in Stage 4 |
| Component reuse hides poor accents | Per-weight composite review and bespoke exceptions | Repeated per-letter failures require direct outlines or local component overrides |
| Four source files are too costly | One-time interpolation may seed intermediate weights | Do not add a variable-font or master system until maintenance evidence shows four SFDs are the bottleneck |

## Milestones

| Milestone | Included stages | Outcome |
|---|---|---|
| Human-source foundation | 0 and 1 | Editable SFD masters, deterministic exporter, procedural generator archived |
| ASCII design candidate | 2 | Human-approved printable ASCII across all four weights |
| Complete coverage candidate | 3 | Exact 283-entry family with all extended glyphs |
| Release candidate | 4 | Structural, deterministic, rendering, and compatibility approval |
| Usable base release | 5 | Published family and coordinated downstream migration |

No milestone advances while an earlier exit gate remains open. If visual evidence changes a rule, update the SFD source, design documentation, specimen expectations, and this plan together rather than preserving a procedural constraint that no longer serves readability.
