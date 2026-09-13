# Troubleshooting sheetsee-tables

## Blank table / nothing renders

1. Open the browser console. A missing template throws when `document.getElementById(templateID)` is null.
2. Confirm template id equals `tableDiv` without `#` + `_template`, **or** set `templateID` explicitly.
3. Confirm Mustache fields match data keys exactly (`{{PlaceName}}` vs `{{placename}}`).
4. Confirm `data` is a non-empty array of objects before calling `makeTable`.

## Filter / Clear does nothing

`initiateTableFilter` returns early unless **all** are true:

- An element with `class="clear"` exists (not `class=".clear"`)
- `filterDiv` is set
- An element with that id exists

## Sort clicks do nothing

Headers need `class="tHeader"`. Sort looks up `innerHTML` with spaces/non-word chars stripped — keep header text aligned with spreadsheet keys.

## Old website demos 404 / hang

Use the local demo in `test/` (`npm run bfy` then serve that folder). Do not depend on `http://jlord.us/...` links.

## Pagination looks wrong after filtering

Filtering rebuilds pagination from the filtered list. Clear the filter (`.clear`) to restore the full dataset.
