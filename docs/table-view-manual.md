# Create a table view from spreadsheet data

This guide shows the complete path from rows of spreadsheet-style data to a searchable, sortable, paginated table.

## 1. Prepare data

Sheetsee Tables expects an array of objects. Each object is one spreadsheet row. Keep the object keys consistent because the template and sortable headers use those names.

```javascript
var data = [
  {
    "City": "Oakland",
    "PlaceName": "Lake Merritt",
    "Year": "2024"
  },
  {
    "City": "Portland",
    "PlaceName": "Forest Park",
    "Year": "2023"
  },
  {
    "City": "Seattle",
    "PlaceName": "Pike Place Market",
    "Year": "2022"
  }
]
```

If your source is a spreadsheet loaded by Tabletop.js, pass the rows returned by Tabletop as `data`.

## 2. Add the table placeholder

Add a filter input, a clear link, and the empty table container to your HTML.

```html
<input id="siteTableFilter" type="text" placeholder="filter by..">
<a href="#" class="clear">Clear</a>
<div id="siteTable"></div>
```

The `clear` class is required if you call `Sheetsee.initiateTableFilter()`.

## 3. Add the Mustache template

The default template id is the table div id plus `_template`. For `#siteTable`, use `siteTable_template`.

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

Use `tHeader` on any header the user should be able to sort. Header text is converted into a data key by removing spaces and punctuation, so `Place Name` maps to `PlaceName`.

## 4. Build the table

Create a `tableOptions` object, then call `Sheetsee.makeTable()`. If you added the filter input, call `Sheetsee.initiateTableFilter()` too.

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

`pagination` is optional. If you omit it, Sheetsee Tables displays all rows at once.

## 5. Run the local demo

From this repository:

```bash
npm install
npm run bfy
```

Then open `test/index.html` in a browser. The demo uses the same pattern shown above and exercises filtering, sorting, and pagination.
