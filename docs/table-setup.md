# Step-by-step table setup

This guide shows the smallest working path from spreadsheet-shaped data to a sortable, filterable Sheetsee table.

## 1. Prepare the data

Sheetsee expects an array of objects. Each object is one row and each object key is a spreadsheet column name.

```javascript
var data = [
  { City: 'Oakland', PlaceName: 'Lake Merritt', Year: '2017', Image: 'lake.jpg' },
  { City: 'Detroit', PlaceName: 'Eastern Market', Year: '2019', Image: 'market.jpg' }
]
```

Keep the object keys stable. Sorting removes spaces and punctuation from the table header text, so a header such as `Place Name` maps to the `PlaceName` data key.

## 2. Add the filter and table placeholder

Add an optional filter input, a clear link with the `clear` class, and an empty div for the table.

```html
<input id="siteTableFilter" type="text" placeholder="filter by...">
<a href="#" class="clear">Clear</a>
<div id="siteTable"></div>
```

The table placeholder id is used again in the JavaScript options.

## 3. Add the Mustache template

The template id should match the table placeholder id plus `_template`. For `#siteTable`, the default template id is `siteTable_template`.

```html
<script id="siteTable_template" type="text/html">
  <table>
    <tr>
      <th class="tHeader">City</th>
      <th class="tHeader">Place Name</th>
      <th class="tHeader">Year</th>
      <th class="tHeader">Image</th>
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

Headers with the `tHeader` class can be clicked to sort. The rendered values use the exact data keys from step 1.

## 4. Build the table

Pass the same data and element ids into `Sheetsee.makeTable`. Then enable filtering with `Sheetsee.initiateTableFilter`.

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

`templateID` is optional when your template follows the `tableDiv + "_template"` naming convention. Add it only when you want to use a different template id.

## 5. Check the demo

Run the bundled test demo locally:

```bash
npm install
npm run bfy
```

Then open `test/index.html` in a browser and confirm:

- The table renders rows from `test/data.js`.
- Clicking a `tHeader` table header changes sort order.
- Typing into the filter input narrows the rows.
- Clicking `Clear` empties the filter input and restores the table.
- Pagination links move between pages when enough rows are present.

For a simple static server instead of opening the file directly, run one from the project root and visit the test page:

```bash
python -m http.server 8765
```

Then open `http://127.0.0.1:8765/test/index.html`.

## Troubleshooting

- If the table area is empty, check that `tableDiv` points to an existing element id.
- If the template is not found, either use `tableDiv` plus `_template` or pass `templateID`.
- If sort does nothing, make sure headers use `class="tHeader"` and their text maps to a data key after spaces and punctuation are removed.
- If clear does nothing, use `class="clear"` rather than `class=".clear"`.
