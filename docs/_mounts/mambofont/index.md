---
title: MamboFont
description: Project Mambo's generated blocky monospace typeface.
order: 60
---

::page{layout="project" width="normal" sidebar=true}

# MamboFont

MamboFont is Project Mambo's blocky monospace typeface. The current pilot uses generated outlines; the approved delivery plan moves design ownership to four human-edited FontForge sources and keeps automation for validation, deterministic export, and review.

::button{label="Source code" href="https://github.com/ProjectMambo/MamboFont" variant="secondary" external=true}

## Family

- **Mambo Font** is a 500-unit monospace family in Regular 400, Medium 500, SemiBold 600, and Bold 700.

## Design

The family uses square counters, right-angle corners, and no rounded or beveled corner treatment. True diagonals remain only when they identify the glyph and have level ends. Optical positions come from named proportional guides, and all weights share one blueprint topology while thickness grows inward.

Every vulnerable counter, aperture, or notch owns a declarative recipe contract: its minimum clearance and what the recipe does if the natural space is smaller. The default is 80 font units. Identity-bearing apertures such as the lower `g` tail are kept open; tiny `A`, `M`, `W`, `m`, and `w` voids fill when they fall below the threshold. Compiled Bold outlines are raster-gated at 14, 16, and 24 pixels; 10 and 12 pixels are stress tests only.

The current compiler contains 94 drawn ASCII glyphs plus 67 deliberate empty entries covering C0, regular space, DEL, C1, and no-break space, for 161 encoded entries. The milestone manifest covers 283 encoded entries: U+0000–U+00FF plus the 27 defined printable Windows-1252 additions. The same 67 entries remain empty across that target; the remaining 216 require drawn geometry.

The active project covers only the base text family. Previous Mambo Icons assets and generator work are archived until a separate icon-font project is resumed.

## Documentation

::children{view="list" sort="order" direction="asc" show=["title","description"]}

## Current status

Version 0.4.0 is an intentionally incomplete design pilot. The direct-outline generator, gap policy, and local validation exist; no release files, tag, or downstream migration have been made.

The JSON project manifest and strict standard-library evaluator now resolve `.notdef` and every printable ASCII glyph across all four weights. The config covers rectangles, bars, true and receiver-aware diagonals, explicit polygons, subtraction, reusable components, and both threshold-driven gap actions. `compile`, `check`, and `specimen` all consume this same JSON source; the glyph-specific Python recipes were removed after exact normalized-contour parity was proven.

The JSON geometry system remains the current implementation only until the human-source cutover. The custom `mbfont edit` browser editor is cancelled; FontForge will edit four SFD sources directly, and the build will validate and export without changing contours. The [development plan](Development%20Plan.md) defines the archive, cutover, human ASCII redraw, extended coverage, quality, and release gates.

The next drawn-coverage phase still has 122 Latin-1 and Windows-1252 glyphs pending. Status and standards documentation may publish during the pilot; font artifacts and downstream consumer pins remain unchanged until the full base family becomes a usable release.
