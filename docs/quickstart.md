# Quickstart: create a table view

This guide shows the smallest path from tabular data to a sortable, searchable, paginated table.

`sheetsee-tables` expects an array of row objects. In a full Sheetsee project, that array usually comes from a spreadsheet loader such as Tabletop.js. For a local demo, you can use a plain JavaScript array first and swap in spreadsheet data later.

## 1. Install and build the local demo

From this repository:

```bash
npm install
npm run bfy
open test/index.html
```

`npm run bfy` browserifies `test/set.js` into `test/sheetsee.js`, which exposes the module as `window.Sheetsee` for the demo page.

## 2. Prepare row data

Each object key becomes the value you reference in the Mustache template.

```javascript
var data = [
  { "City": "Oakland", "PlaceName": "Lake Merritt", "Year": "1870" },
  { "City": "San Francisco", "PlaceName": "Sutro Baths", "Year": "1896" },
  { "City": "Berkeley", "PlaceName": "Tilden Park", "Year": "1936" }
]
```

When using spreadsheet data, normalize the spreadsheet headers so they match the object keys you want to render and sort by.

## 3. Add a filter input and table placeholder

```html
<input id="siteTableFilter" type="text" placeholder="filter by..">
<a href="#" class="clear">Clear</a>
<div id="siteTable"></div>
```

The `filterDiv` option must point at the input id. The clear link must use the `clear` class.

## 4. Add a Mustache table template

The default convention is `tableDiv` without `#`, plus `_template`. For `#siteTable`, the default template id is `siteTable_template`.

```html
<script id="siteTable_template" type="text/html">
  <table>
    <tr>
      <th class="tHeader">City</th>
      <th class="tHeader">Place Name</th>
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

Headers with `class="tHeader"` are clickable sort headers. The visible text is converted to a data key by removing spaces and punctuation, so `Place Name` maps to `PlaceName`.

## 5. Build the table

```html
<script>
  document.addEventListener('DOMContentLoaded', function () {
    var tableOptions = {
      data: data,
      pagination: 10,
      tableDiv: '#siteTable',
      filterDiv: '#siteTableFilter'
    }

    Sheetsee.makeTable(tableOptions)
    Sheetsee.initiateTableFilter(tableOptions)
  })
</script>
```

You can also pass `templateID: 'siteTable_template'` explicitly, but it is not required when you follow the default naming convention.

## 6. Troubleshooting

- Empty page: confirm `test/sheetsee.js` exists. Run `npm run bfy` again.
- Template error: confirm the template id matches `tableDiv + '_template'`, or pass `templateID` explicitly.
- Filtering does nothing: confirm the input id matches `filterDiv`, and that the clear link uses `class="clear"`.
- Sorting does nothing: confirm each sortable header has `class="tHeader"` and that its text maps to a row key after spaces and punctuation are removed.
- Spreadsheet data does not show: inspect the array produced by your spreadsheet loader and confirm its keys match the template variables.

