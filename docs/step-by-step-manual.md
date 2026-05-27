# Step-by-Step Manual

This guide builds a sortable, searchable, paginated table from spreadsheet-like rows. Sheetsee Tables receives data as an array of objects, so the same setup works whether the rows came from Tabletop, a CSV parser, or a JSON export.

## 1. Prepare the Row Data

Each object key is a column name. Keep keys simple and consistent because sortable table headers are matched to keys by removing spaces and punctuation from the header text.

```javascript
var data = [
  {City: 'Oakland', PlaceName: 'Lake Merritt', Year: '1870', Type: 'Park'},
  {City: 'San Francisco', PlaceName: 'Ferry Building', Year: '1898', Type: 'Market'},
  {City: 'Berkeley', PlaceName: 'Campanile', Year: '1914', Type: 'Landmark'}
]
```

## 2. Add the Filter and Table Placeholder

The filter is optional, but if you use it the input ID must match `filterDiv`. The clear link must use `class="clear"`.

```html
<input id="siteTableFilter" type="text" placeholder="filter by city, place, or type">
<a href="#" class="clear">Clear</a>
<div id="siteTable"></div>
```

## 3. Add a Mustache Table Template

The easiest convention is to name the template after the table placeholder plus `_template`. For `#siteTable`, use `siteTable_template`.

```html
<script id="siteTable_template" type="text/html">
  <table>
    <tr>
      <th class="tHeader">City</th>
      <th class="tHeader">Place Name</th>
      <th class="tHeader">Year</th>
      <th class="tHeader">Type</th>
    </tr>
    {{#rows}}
      <tr>
        <td>{{City}}</td>
        <td>{{PlaceName}}</td>
        <td>{{Year}}</td>
        <td>{{Type}}</td>
      </tr>
    {{/rows}}
  </table>
</script>
```

The header text `Place Name` sorts the `PlaceName` key because Sheetsee removes spaces and punctuation before matching the row object key.

## 4. Build the Table

Call `makeTable` after the page and data are available. Then call `initiateTableFilter` if the page includes a filter input.

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

## 5. Complete Copy-Paste Example

This example assumes `sheetsee.js` is the browser bundle built by `npm run bfy`.

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Sheetsee table example</title>
  <script src="./sheetsee.js"></script>
  <style>
    body { font-family: sans-serif; margin: 2rem; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border-bottom: 1px solid #ddd; padding: 0.5rem; text-align: left; }
    .tHeader { cursor: pointer; }
    .table-pagination a { cursor: pointer; margin-left: 0.75rem; }
    .no-pag { color: #999; pointer-events: none; }
  </style>
</head>
<body>
  <input id="siteTableFilter" type="text" placeholder="filter rows">
  <a href="#" class="clear">Clear</a>
  <div id="siteTable"></div>

  <script id="siteTable_template" type="text/html">
    <table>
      <tr>
        <th class="tHeader">City</th>
        <th class="tHeader">Place Name</th>
        <th class="tHeader">Year</th>
        <th class="tHeader">Type</th>
      </tr>
      {{#rows}}
        <tr>
          <td>{{City}}</td>
          <td>{{PlaceName}}</td>
          <td>{{Year}}</td>
          <td>{{Type}}</td>
        </tr>
      {{/rows}}
    </table>
  </script>

  <script>
  var data = [
    {City: 'Oakland', PlaceName: 'Lake Merritt', Year: '1870', Type: 'Park'},
    {City: 'San Francisco', PlaceName: 'Ferry Building', Year: '1898', Type: 'Market'},
    {City: 'Berkeley', PlaceName: 'Campanile', Year: '1914', Type: 'Landmark'}
  ]

  document.addEventListener('DOMContentLoaded', function () {
    var tableOptions = {
      data: data,
      pagination: 2,
      tableDiv: '#siteTable',
      filterDiv: '#siteTableFilter'
    }

    Sheetsee.makeTable(tableOptions)
    Sheetsee.initiateTableFilter(tableOptions)
  })
  </script>
</body>
</html>
```

## Troubleshooting

- Empty page: confirm the script bundle is loaded before calling `Sheetsee.makeTable`.
- Template not found: confirm the template ID matches `tableDiv` without `#` plus `_template`, or pass `templateID` explicitly.
- Sorting does nothing: confirm the clicked header has `class="tHeader"` and its text matches a data key after removing spaces and punctuation.
- Filter does nothing: confirm the filter input ID matches `filterDiv`, and the clear link uses `class="clear"`.
- Pagination does not appear: confirm `pagination` is a number smaller than the number of rows.

## Local Verification

From the project root:

```sh
npm install
npm run bfy
```

Then open `test/index.html` or a copy of the complete example in a browser and confirm the table renders, sorting changes row order, filtering narrows the rows, and pagination moves between pages.
