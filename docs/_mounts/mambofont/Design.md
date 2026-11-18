---
description: Geometry, weight, coverage, and compatibility rules for MamboFont.
title: Design rules
order: 20
---

::page{layout="docs" width="normal" sidebar=true}

# Design rules

## Scope and ownership

Mambo Font keeps the character of the archived v0.2 drawings while making its outlines, weights, and coverage systematic. The active generator owns only the base text family. Previous Mambo Icons drawings, binaries, and generator code live under `archive/`; icon design and a separate icon font are deferred until the base family reaches a usable release.

The notes vault owns the canonical documentation under `notes/Docs/Projects/MamboFont/`. The MamboFont repository and MamboWiki receive synchronized documentation snapshots. Publishing pilot status or standards documentation does not publish font artifacts or change downstream provider pins.

## Current source architecture

The font has one short, direct path from parameters to binaries:

1. `sources/font.json` defines family metadata, dimensions, proportional named guides, weights, review settings, target coverage, deliberate empty ranges, and source paths.
2. `sources/components.json` and `sources/glyphs/U+XXXX.json` define reusable geometry and each character recipe, including explicit decisions for readability-sensitive gaps.
3. `sources/config.py` strictly validates and resolves that JSON through the generic filled-outline primitives in `sources/model.py`.
4. `script/mbfont.py` compiles the resolved contours, normalizes and validates them, writes TTF and WOFF2, byte-checks candidates, and generates the review specimen.
5. `tests/test_config.py` and `tests/test_build.py` check the source contract, raster outcomes, metadata, format validity, and deterministic builds.
6. `specimen.html` is generated review output, not another source of glyph geometry.

There is no SVG-to-font source pipeline and no cache. SVG appears only in the specimen's blueprint cards. Editing JSON and rebuilding is the complete source-of-truth workflow; no glyph-specific Python recipe module remains.

## Human-drawn source direction

The JSON blueprint system above remains the current implementation until an atomic source cutover, but it is superseded as the delivery direction. The ASCII pilot showed that procedural rules can reproduce metrics and enforce gap decisions, yet optical correction is slower and less direct than editing the final outlines.

The target source path is:

~~~text
sources/MamboFont-Regular.sfd
sources/MamboFont-Medium.sfd
sources/MamboFont-SemiBold.sfd
sources/MamboFont-Bold.sfd
        |
        v
validate without changing contours
        |
        +--> TTF
        +--> WOFF2
        +--> specimen
~~~

FontForge is the authoring interface. Its native SFD files own contours, components, anchors, guides, widths, and per-weight optical correction. MamboFont will not build a browser, Rust, native, or terminal editor unless later evidence identifies a specific workflow that FontForge cannot provide.

Each weight is an independent reviewed source. Regular and Bold may seed Medium and SemiBold through one explicit interpolation experiment, but any result must be saved and manually corrected. Normal builds never interpolate or derive one weight from another.

### Source boundary

After cutover, `font.json` retains only family metadata, the weight-to-SFD mapping, required coverage, deliberate empty glyphs, and review sizes. It no longer contains glyph geometry. The JSON glyph recipes, components, evaluator, primitive model, and JSON-specific tests move together to `archive/v0.4-json-prototype/`.

Generated TTF, WOFF2, SVG, HTML, and raster files remain derived artifacts. The four SFD files are the only active outline source. The archived `0.2.4` family and `0.4.0` pilot remain visual and recovery references rather than mandatory contour templates.

### Export boundary

The build opens each SFD, checks it, and exports the requested formats. It may set the requested version and deterministic serialization metadata, but it must not synthesize, interpolate, thicken, simplify, remove overlap, fill gaps, normalize away authored points, or save changes into the source.

A malformed outline fails with its weight and glyph. The author fixes the SFD in FontForge. Point economy, contour direction, overlap removal, component placement, and optical gap decisions are source work rather than hidden compiler repairs.

The existing `compile`, `check`, and `specimen` commands keep their useful roles through the transition. The custom `mbfont edit` command and browser-editor plan are cancelled.

### Validation contract

The human-drawn build continues to enforce objective contracts:

- exact cmap coverage and deliberate empty glyphs;
- 500-unit advances, shared vertical metrics, family names, weight metadata, and licence metadata;
- straight, on-curve outlines while the no-curves style contract remains active;
- valid directions, no self-intersections, safe bounds, and no accidental overlaps or point contacts;
- FontForge validation before and after export;
- monospace classification, `fontlint`, and deterministic TTF and WOFF2 output;
- selected ambiguity and small-size checks that catch lost identity without freezing every rejected pilot contour.

Human review owns optical quality. The specimen must show all four weights, the complete supported set, ambiguity groups, punctuation, accents, repeated dense glyphs, prose, and code-like text at 14, 16, 24, and display sizes.

### Transition gate

Do not delete the active JSON path before four SFD baselines reproduce the current 161-entry cmap, 67 empty glyphs, advances, line metrics, metadata, and deterministic export behavior. At that gate, archive the procedural implementation and switch the commands in the same commit so the repository never has two active outline authorities.

The [development plan](Development%20Plan.md) owns the dependency order, human redraw, extended coverage, compatibility, and release milestones.

## Current procedural pilot details

Until the transition gate passes, the existing JSON files, gap rules, compiler pipeline, tests, and commands remain the factual `0.4.0` pilot behavior described below. They are maintained only to support the source cutover and are not a platform for new editor work.

## Coordinate and weight model

Every encoded glyph currently advances 500 units in a 1000-unit em. The compiler reads that advance from `Design` rather than embedding 500 in the outline stage. The fixed default vertical metrics are an 800-unit ascent and 200-unit descent; line metrics do not change between weights.

The default `x` guides include cell edges 0 and 500, ink edges 40 and 460, center 250, and upper-bowl receiver 390. The inner guides remain weight-dependent at `ink_left + thickness` and `ink_right - thickness`. Shared optical positions have names and ratios within the ink width: diagonal terminals at 5/42 from either edge, the `1` flag at 5/21 from the left, lowercase stem at 11/42, `r` shoulder at 31/42, lowercase foot at 5/6, and the upper `B` receiver at two thirds of the distance from center to the right ink edge. A few punctuation layouts use explicit coordinates as deliberate optical exceptions in the default 500-unit cell.

The default `y` guides are descender -140, baseline 0, x-mid at half the x-height, midline at half the cap height, x-height 400, cap height 640, and ascender 800. Former literal join positions are also derived: the `r` join is 3/5 of x-height, the `M` join is 13/32 of cap height, the `1` flag is 25/32 of cap height, and accent height is 3/4 of the way from cap height to ascender. This keeps optical relationships intact when the design dimensions change. `Design` rejects dimensions that cannot leave room for the declared protected gaps.

| Style | CSS weight | Nominal thickness |
|---|---:|---:|
| Regular | 400 | 80 |
| Medium | 500 | 93 |
| SemiBold | 600 | 107 |
| Bold | 700 | 120 |

All four weights use the same blueprint fields and glyph recipes. Exterior surfaces normally stay fixed while weight grows inward. A local thickness, receiver clip, or conditional fill patch is allowed when a declared gap contract requires it for readability; such a fill may intentionally add one source contour at a heavier weight.

## Blueprint and style grammar

A glyph JSON document contains its code point, name, advance, review state, named values and points, ordered shapes, gap contracts, and future composition anchors. The resolver turns that source into a three-part compiler blueprint:

- `ink`: additive filled contours.
- `cuts`: explicit negative contours for counters or holes.
- `gaps`: named `GapRule` records for vulnerable clearances.

Glyph recipes select guide intersections and use a small primitive set: rectangles, horizontal and vertical bars, constant-perpendicular-width diagonal polygons with horizontal caps, receiver-aware joined diagonals, and explicit polygons. Explicit polygons or cuts are used only when the reusable primitives cannot express the intended shape. Scalars are literals, references, affine sums of references, or complete per-weight values; arbitrary Python expressions and `eval` are not accepted.

The visual rules are:

- Counters and bowl corners are square. Rounded, beveled, or corner-smoothing surfaces are outside the grammar.
- Horizontal and ordinary vertical terminals stay level. A diagonal is a true straight band with parallel sides and level ends, never a staircase, except for a declared receiver-cap clip at an outer ink bound.
- Slanted surfaces appear only where the glyph's identifying diagonal requires them. Joined diagonal endpoints sit inside their receiving bar or stem so no shelf, spike, concave corner, or point contact remains.
- M, N, and W retain vertical exterior stems and place their diagonals inside. A, V, and X retain identity-critical exterior diagonals.
- Receiver caps in `1` and `?` are clipped to the stem they join. The `5` and `7` use the same receiver-aware diagonal calculation as `Z` and `2`, so their level ends terminate flush with the connected horizontal bars.
- Ambiguous monospace characters remain distinct: serifed `I`, footed `l`, flagged `1`, square `O`, and slashed `0`.
- Readability outranks nominal thickness only at a declared local exception; the rest of the glyph keeps the weight's nominal thickness.

### Printable-ASCII recipe families

The active pilot contains all 95 printable ASCII code points. Recipes share geometry by visual grammar rather than by alphabetic order:

- Square frames and open `C` frames form `B`, `C`, `E`, `G`, `O`, `P`, `D`, the round lowercase family, and the enclosed figures.
- Exterior stems plus internal diagonals form `M`, `N`, `W`, and their lowercase relatives. `A`, `K`, `R`, `V`, `X`, `Z`, and the diagonal figures use true level-capped diagonal polygons where the diagonal identifies the character.
- `Z`, `z`, and `2` use receiver-aware diagonal polygons whose ends meet their horizontal bars without exposed shelves. Lowercase `s` instead uses a compact square S construction so `s` and `z` remain distinct.
- Dense horizontal stacks in `a`, `e`, and `s` may use locally thinner horizontal bars. Ordinary punctuation, dots, commas, the `#` grid, `%`, and punctuation diagonals use the weight's full nominal thickness. The compact `@` construction alone uses half of nominal thickness so both its counter and exit remain visible; this is an explicit readability exception, not an alternate weight.
- Punctuation is assembled from the same rectangles, square dots, and true diagonals. Parentheses use one direct angular outline with diagonal upper and lower sides, brackets remain orthogonal, mirrored pairs share one source recipe, and `~` is a three-segment diagonal zigzag. The dollar uses two full-thickness vertical segments that enter its upper and lower spaces without blacking out the middle. The ampersand follows the archived angular crossed-stroke topology. `%` uses solid square nodes because miniature counters would not survive the supported review floor.

## Gap rules

The compiler never guesses whether a small space matters. A vulnerable glyph declares a `GapRule` as a recipe contract with a name, its `natural` clearance, its own `minimum`, an `on_small` action, and the geometry's `resolved` clearance.

The design-level defaults are a 14-pixel review floor and an 80-unit minimum gap. Eighty units corresponds to 1.12 pixels at 14 ppem before rasterization. The rule is evaluated as follows:

1. If `natural >= minimum`, the outcome is `preserve` and `resolved` must equal `natural`.
2. If `natural < minimum` and `on_small` is `widen`, the glyph recipe changes local geometry and `resolved` must be at least that rule's `minimum`.
3. If `natural < minimum` and `on_small` is `fill`, the space closes completely and `resolved` must be 0.
4. A nonzero result below the rule's `minimum` is invalid.

The glyph author chooses `widen` or `fill` because that choice is semantic. A space is widened when keeping it open is required for recognition. It is filled when a sub-threshold pinhole or tapered notch is less readable than a complete surface. The contract validates author-supplied scalar values; it does not run a generic nearest-distance scan or reshape a finished outline.

Clearance is measured at a glyph-declared protected cross-section, not by a global closest-point search. For example, a stacked horizontal space is measured vertically between bars, a center notch at its open edge, and a slash window where the slash passes the frame. A taper endpoint that is intentionally buried in a receiver is outside the protected section; treating it as a zero-width gap would be a false collision.

The `0` slash always uses the weight's nominal thickness. It has no automatic thinning fallback; if review finds its windows too small, the glyph must gain an explicit rule and raster check rather than silently changing weight.

The Bold pilot resolves its declared gaps as follows. Values are font units, rounded here to one decimal place.

| Glyph | Protected space | Natural | Minimum | Outcome | Resolved geometry |
|---|---|---:|---:|---|---:|
| `A` | upper counter | 6.3 | 80 | fill the upper triangular sliver | 0 |
| `@` | nested-frame clearance | 20.0 | 80 | widen with half-thickness local frames | 80.0 |
| `B` | bowl counters | 110.0 | 80 | preserve | 110.0 |
| `M` | tapered center notch | 56.7 | 80 | fill the complete notch | 0 |
| `W` | tapered center notch | 55.3 | 80 | fill the complete notch | 0 |
| `a` | spaces between horizontal bars | 20.0 | 80 | widen with 80-unit local horizontal bars | 80.0 |
| `e` | spaces between horizontal bars | 20.0 | 80 | widen with 80-unit local horizontal bars | 80.0 |
| `g` | lower tail aperture | 80.0 | 80 | preserve | 80.0 |
| `m` | tapered center notch | 48.4 | 80 | fill the complete notch | 0 |
| `s` | spaces between horizontal bars | 20.0 | 80 | widen with 80-unit local horizontal bars | 80.0 |
| `w` | tapered center notch | 48.4 | 80 | fill the complete notch | 0 |
| `y` | lower tail aperture | 80.0 | 80 | preserve | 80.0 |

The same declarations run at every weight. `A` fills at all four current weights. The `M`, `W`, `m`, and `w` notches remain naturally open in Regular, Medium, and SemiBold, then fill in Bold. The `g` and `y` hooks reach the full -200 descent so their declared lower apertures retain at least 80 units without thinning the main stems.

## Outline compilation

Glyph recipes already produce filled contours; FontForge never expands a stroked path. Compilation is ordered so cuts cannot be destroyed by an earlier overlap:

1. Add every positive `ink` contour clockwise.
2. Union positive overlaps and correct their direction.
3. Add each `cut` counterclockwise.
4. Union remaining overlaps, correct directions, and round coordinates to integer font units.
5. Remove only exact duplicate vertices and vertices that are collinear in the same direction.
6. Correct direction again, canonicalize contour order and start points, then validate the glyph.
7. Set the advance from `Design` (500 in the current family), assemble fixed font metadata, generate TTF and WOFF2 to temporary files, reopen and validate them, then atomically replace the destination.

No generic smoothing, morphology, or tolerance-based simplification runs after the glyph rule. Those operations could round a hard corner, erase an intentional opening, or silently make the `widen`/`fill` decision. The final TrueType outlines contain only straight, on-curve vertices.

Build ordering and the source epoch are fixed. `check` rebuilds selected formats in a temporary directory and requires byte-for-byte equality with the local candidate.

## Small-size and build validation

Fourteen ppem is the pilot's geometry and readability review floor, not a promise about every renderer or platform. The 10- and 12-pixel specimen rows are non-gating stress tests and the font is not designed for sizes below 14. Browser review at 14, 16, and 24 pixels remains a human gate across all four weights; the 64-pixel sample and blueprint cards expose shape and join defects.

The end-to-end check enforces:

- The current 161-code-point map: 94 drawn ASCII glyphs plus 67 deliberate empty controls and spaces, fixed advances, bounds, line metrics, metadata, and valid TTF/WOFF2 files.
- Valid blueprint fields and declared gap outcomes at every weight, including zero clearance for a triggered fill.
- Direct filled outlines, safe bounds, all configured empty glyphs remaining contourless, and no active stroke expansion.
- Integer, all-on-curve output with no duplicate or removable collinear points.
- Every declarative gap scalar: preserved values remain unchanged, widened values reach their rule's minimum, and the validated `fill` branch resolves to zero. This check does not remeasure final contours.
- Expected Bold gap outcomes plus one-bit 14-, 16-, and 24-ppem XBM goldens for the protected `g` tail aperture.
- A unique one-bit raster signature for every non-space ASCII glyph at 14, 16, and 24 ppem, catching collisions such as `B`/`8`, `s`/`z`, or punctuation that loses its identifying detail.
- Two independent builds with byte-identical TTF and WOFF2 output. The separate `check` command then compares a clean rebuild with the local candidate.

FontForge validation is mandatory during generation and after reopening each file. Maintainer review also includes `fontlint`, `fc-scan`, and the generated specimen before a release candidate is approved.

## Coverage and release gates

The milestone target contains 283 encoded entries:

- The complete U+0000–U+00FF range.
- The 27 defined printable Windows-1252 additions.

C0 controls U+0000–U+001F, space U+0020, DEL and C1 controls U+007F–U+009F, and no-break space U+00A0 are encoded with the 500-unit family advance and no contours. This includes Unicode control characters at U+0080–U+009F as empty glyphs while the printable Windows-1252 characters for those byte positions use their actual Unicode code points such as U+20AC. Undefined Windows-1252 byte positions do not create extra mappings beyond their corresponding empty Unicode C1 controls.

The 67 empty entries leave 216 drawn glyphs. The current compiler contains all 94 drawn ASCII glyphs plus every declared empty entry, for 161 encoded glyphs in total. The JSON manifest already declares all 283 target entries, leaving 122 extended drawn glyphs pending. Latin-1 and printable Windows-1252 drawing begins after the SFD cutover and human ASCII approval defined by the development plan.

A usable base-font release requires all 283 target entries, all four weights, an explicit gap decision for every vulnerable drawn glyph, passing structural/deterministic/raster checks, visual approval at the supported review sizes, approved final family metadata and binaries, and no unresolved base-font design blockers. Only then are release files and a tag created and downstream artifact consumers migrated. Documentation may publish before that gate. Icon work remains a separate later milestone.
