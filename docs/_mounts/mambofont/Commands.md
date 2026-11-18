---
description: Generate, compare, and visually review MamboFont.
title: Command reference
order: 10
---

::page{layout="docs" width="normal" sidebar=true}

# Command reference

## Requirements

Building requires Python 3 with FontForge's Python bindings. WOFF2 support must be available in the installed FontForge build.

Every command can be run directly:

~~~bash
./script/mbfont.py --help
./script/mbfont.py --version
~~~

Or install a local mbfont symlink:

~~~bash
./script/install.sh
mbfont --help
~~~

The installer uses $HOME/.local/bin by default. Set MAMBOFONT_BIN_DIR to select another command directory. It refuses to replace a non-symlink and does not install compiled fonts into the operating system.

This installed command is the unreleased `0.4.0` pilot. It is not the provider for MamboSite's pinned `0.2.4` `MamboFont-*.woff2` assets.

### Update or remove the pilot command

The installed command is a symlink to this checkout, so updating the checkout updates the command without copying another executable. Rerun `./script/install.sh` only after moving the checkout or changing `MAMBOFONT_BIN_DIR`.

To remove the command from the repository root, delete only a symlink that resolves to this checkout:

~~~bash
command_path="${MAMBOFONT_BIN_DIR:-$HOME/.local/bin}/mbfont"
expected_path="$(readlink -f ./script/mbfont.py)"
if [ -L "$command_path" ] && [ "$(readlink -f "$command_path")" = "$expected_path" ]; then
    rm -- "$command_path"
else
    printf 'refusing to remove unowned path: %s\n' "$command_path" >&2
fi
~~~

Removing the link leaves the checkout, generated pilot files, and any separately installed released fonts unchanged.

## Exit status

`mbfont` returns `0` for successful help, version, compile, check, or specimen work; `1` for a build, validation, missing-file, or stale-output failure; and `2` for invalid command syntax or option values. A failing FontForge operation may include its diagnostic on standard error before the command returns non-zero.

## Compile

~~~text
mbfont compile [X.Y.Z] [--config FILE] [--out DIR] [--format ttf woff2]
~~~

The version defaults to the generator's current version and must be exact core SemVer such as 0.4.0. The config defaults to `sources/font.json`, the output directory defaults to build/pilot, and both file formats are generated when --format is omitted.

Build all four weights:

~~~bash
mbfont compile 0.4.0 --format ttf woff2 --out build/pilot
~~~

Build only text TTF files into a temporary review directory:

~~~bash
mbfont compile 0.4.0 --format ttf --out /tmp/mambofont
~~~

The pilot produces Regular, Medium, SemiBold, and Bold under the temporary internal family name Mambo Font Pilot. Each output is validated before it atomically replaces its destination.

## Check committed candidates

~~~text
mbfont check [X.Y.Z] [--config FILE] [--out DIR] [--format ttf woff2]
~~~

Check rebuilds into a temporary directory and byte-compares every selected file with the destination. A missing or stale file makes the command fail.

~~~bash
mbfont check 0.4.0 --format ttf woff2 --out build/pilot
~~~

Generation uses a fixed source epoch and fixed ordering, so identical rules produce identical TTF and WOFF2 bytes. There is no separate build cache.

## Generate the specimen

~~~text
mbfont specimen [X.Y.Z] [--config FILE] [--fonts DIR] [--out FILE]
~~~

The specimen is a local HTML review page containing all four weights and the supported character groups.

~~~bash
mbfont specimen 0.4.0 --fonts build/pilot --out specimen.html
~~~

Open specimen.html in a browser after any geometry, weight, or gap-rule change. It includes all printable ASCII in every weight, ambiguity strings at 10, 12, 14, 16, and 24 pixels, and Regular and Bold geometry cards. Red points on those cards are the final TTF vertices after union, integer rounding, and exact duplicate/collinear cleanup; declared gap decisions appear below vulnerable glyphs. Fourteen pixels per em is the review floor, while 10 and 12 pixels are non-gating stress tests. The command requires the matching WOFF2 pilot files to exist first.

## Current development workflow

1. Change project dimensions, guides, weights, or coverage in `sources/font.json`; reusable geometry in `sources/components.json`; and glyph points, primitives, or gap actions in `sources/glyphs/U+XXXX.json`.
2. Compile all four weights into build/pilot.
3. Regenerate and inspect specimen.html at large and small sizes and in the blueprint views.
4. Run the deterministic end-to-end check.
5. Run `check` against the local candidate directory and inspect the source and specimen diffs together.

~~~bash
./script/mbfont.py compile 0.4.0 --format ttf woff2 --out build/pilot
./script/mbfont.py specimen 0.4.0 --fonts build/pilot --out specimen.html
/usr/bin/python3 tests/test_build.py
./script/mbfont.py check 0.4.0 --format ttf woff2 --out build/pilot
git diff --check
git status --short
~~~

The tests assert all 94 drawn ASCII glyphs, all 67 declared empty controls and spaces, declared fill/widen outcomes, fixed advances, safe bounds, straight on-curve contours with no redundant points, metadata and line metrics, FontForge validity, and deterministic bytes in both formats.

`GapRule` validation checks each recipe's declared `natural`, `minimum`, action, and `resolved` values; it does not run a generic post-outline gap detector. One-bit XBM checks preserve the Bold `g` tail aperture and require every non-space ASCII glyph to remain visually distinct at 14, 16, and 24 pixels. The test also rejects any active call to FontForge's stroke expansion.

## Planned human-drawn source workflow

The commands above still describe the current JSON pilot. That implementation remains available only until the first human-source cutover gate in the [development plan](Development%20Plan.md); no SFD source files exist yet.

The approved target uses FontForge itself as the editor. Four native SFD files own the final outlines, components, anchors, guides, widths, and per-weight optical corrections. The repository does not add `mbfont edit` or another custom GUI.

At cutover, `compile`, `check`, and `specimen` keep their useful roles but change inputs:

~~~text
FontForge SFD sources -> validate without changing contours -> TTF / WOFF2 / specimen
~~~

The build may set the requested version and deterministic serialization metadata. It must not generate, interpolate, thicken, simplify, remove overlap, fill gaps, or save changes into the SFD files. A source problem fails with its weight and glyph so the author can correct the outline in FontForge.

The target authoring loop is:

1. Open the relevant `sources/MamboFont-<Style>.sfd` file in FontForge.
2. Edit contours, components, anchors, metrics, and guides directly; save the SFD source.
3. Run `compile` for all four weights and regenerate `specimen.html`.
4. Review full-size shapes and 14-, 16-, and 24-pixel text across all weights.
5. Run the build test and `check`, then review the SFD and specimen changes together.

Regular and Bold may be used for one explicit interpolation experiment to seed Medium and SemiBold. Any result becomes an independent manually corrected SFD; ordinary builds never interpolate.

The JSON generator, its per-glyph recipes, and JSON-specific tests move together into `archive/v0.4-json-prototype/` only when the SFD sources reproduce the current cmap, advances, empty glyphs, metrics, metadata, and deterministic export behavior. Until that atomic checkpoint, the current commands and tests remain authoritative.

The command grammar does not make pilot artifacts backward-compatible. MamboSite deliberately remains pinned to the released `0.2.4` provider and its `MamboFont-*` files. Provider and consumer changes occur only after the complete human-drawn family passes the release gate.

## Documentation

The canonical source is the notes vault at `notes/Docs/Projects/MamboFont/`. After updating those pages, export MamboFont and its published Wiki mount:

~~~bash
cd ~/ProjectMambo/notes
node Scripts/sync_docs.js --sync MamboFont MamboWiki
~~~

Standards, status, and development pages may publish while the pilot is in progress. Publishing documentation does not publish font artifacts or move MamboSite from its pinned `0.2.4` inputs.

## Publishing

The generator intentionally has no release command. The current printable-ASCII `0.4.0` pilot is not a usable full font and never writes release files to dist. Publishing font artifacts and migrating consumers remain separate maintainer decisions after Latin-1 and Windows-1252 coverage, the design, and committed candidates are approved.
