# Step-by-step: spreadsheet → Sheetsee table

This guide builds a working sortable/searchable table from a Google Spreadsheet using `sheetsee-tables`.

## 0) Prerequisites

- A public Google Spreadsheet (or any array of objects with consistent keys)
- A static HTML page you can serve locally (`python3 -m http.server` is enough)
- Sheetsee / Tabletop wired the way your host project already does (this module only owns the table UI)

If you only want to verify this module, skip to **Local demo** at the bottom.

## 1) Prepare the spreadsheet

1. Put headers in row 1 with **no spaces** if possible (`City`, `PlaceName`, `Year`).
2. Keep capitalization stable — Mustache keys are case-sensitive.
3. Publish / make the sheet readable for Tabletop (File → Share → Anyone with the link can view, or the publish-to-web flow your Sheetsee version expects).

## 2) Add HTML shell

```html
<input id="siteTableFilter" type="text" placeholder="filter by..">
<a href="#" class="clear">Clear</a>
<div id="siteTable"></div>
```

Notes:
- The clear control must be `class="clear"`.
- The table target is `#siteTable`.

## 3) Add the Mustache template

Template `id` = `tableDiv` without `#` + `_template` → `siteTable_template`.

```html
<script id="siteTable_template" type="text/html">
  <table>
    <tr>
      <th class="tHeader">City</th>
      <th class="tHeader">PlaceName</th>
      <th class="tHeader">Year</th>
    </tr>
    {{#rows}}
      <tr>
        <td>{{City}}</td>
        <td>{{PlaceName}}</td>
        <td>{{Year}}</td>
      </tr>
    {{/rows}}
  </table>
</script>
```

`tHeader` enables click-to-sort. Header text is normalized by removing spaces/non-word characters before looking up the data key.

## 4) Load data, then call makeTable

After Tabletop (or your loader) returns an array `data`:

```js
var tableOptions = {
  data: data,
  pagination: 10,
  tableDiv: '#siteTable',
  filterDiv: '#siteTableFilter'
}
Sheetsee.makeTable(tableOptions)
Sheetsee.initiateTableFilter(tableOptions)
```

## 5) Verify

- Rows render
- Clicking a `tHeader` reorders rows
- Typing in the filter narrows rows
- Clear restores the full set
- Pagination appears when `data.length > pagination`

## Local demo (no Google Sheet required)

```bash
npm install
npm run bfy
python3 -m http.server 8765 --directory test
```

Open `http://localhost:8765/` and follow `test/qa.md`.
