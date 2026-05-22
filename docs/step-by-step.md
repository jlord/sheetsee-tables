# Step-by-step table guide

This guide shows the smallest complete path from spreadsheet-shaped data to a searchable, sortable, paginated table.

## 1. Prepare the data

`sheetsee-tables` expects an array of row objects. In a full Sheetsee project this usually comes from Tabletop.js or another spreadsheet loader, but plain JavaScript data works the same way:

```js
var data = [
  { City: 'Oakland', PlaceName: 'Lake Merritt', Year: '1870', Image: 'lake.jpg' },
  { City: 'San Francisco', PlaceName: 'Sutro Baths', Year: '1896', Image: 'sutro.jpg' }
]
```

Keep the object keys consistent. Sortable headers are matched to keys by removing spaces and punctuation from the header text, so `Place Name` maps to `PlaceName`.

## 2. Add the placeholder and filter

The placeholder is where the rendered table is inserted. The filter input is optional, but if you add one you also need a link with the `clear` class.

```html
<input id="siteTableFilter" type="text" placeholder="filter by city">
<a href="#" class="clear">Clear</a>
<div id="siteTable"></div>
```

## 3. Add the Mustache table template

The template id must match the `templateID` value passed to `Sheetsee.makeTable`.

```html
<script id="siteTable_template" type="text/html">
  <table>
    <tr>
      <th class="tHeader">City</th>
      <th class="tHeader">Place Name</th>
      <th class="tHeader">Year</th>
      <th>Image</th>
    </tr>
    {{#rows}}
      <tr>
        <td>{{City}}</td>
        <td>{{PlaceName}}</td>
        <td>{{Year}}</td>
        <td>{{Image}}</td>
      </tr>
    {{/rows}}
  </table>
</script>
```

Use the `tHeader` class on headers that should sort when clicked.

## 4. Build the table

Create one options object and pass it to the table builder. If you omit `templateID`, Sheetsee assumes the template id is the table div id plus `_template`, so `#siteTable` becomes `siteTable_template`.

```html
<script>
  document.addEventListener('DOMContentLoaded', function () {
    var tableOptions = {
      data: data,
      pagination: 10,
      tableDiv: '#siteTable',
      filterDiv: '#siteTableFilter',
      templateID: 'siteTable_template'
    }

    Sheetsee.makeTable(tableOptions)
    Sheetsee.initiateTableFilter(tableOptions)
  })
</script>
```

## 5. Try the included demo

From this repository:

```bash
npm install
npm run bfy
```

Then open `test/index.html`. The demo includes working data, the table placeholder, the filter input, the template, sorting headers, and pagination.

## Troubleshooting

- If no table appears, confirm that `tableDiv` points to an existing element id.
- - If the template is not found, confirm `templateID` matches the `<script>` id exactly.
  - - If filtering does nothing, confirm `filterDiv` points to the input id and the clear link uses `class="clear"`.
    - - If sorting does nothing, confirm the clickable headers use `class="tHeader"`.
      - - If a column sorts incorrectly, confirm the header text maps to the data key. For example, `Place Name` maps to `PlaceName`.
        - 
