# Step-by-step table setup

This guide shows the smallest reliable path from spreadsheet-style data to a searchable, sortable, paginated table.

## 1. Add a table placeholder

Add an input for filtering, a clear link, and an empty div where the table will be rendered.

```html
<input id="siteTableFilter" type="text" placeholder="filter by..">
<a href="#" class="clear">Clear</a>
<div id="siteTable"></div>
```

The clear link must use `class="clear"`. Do not include the dot in the class attribute.

## 2. Add a Mustache template

Place a template script on the same page. By default, the template id must match the table div id with `_template` appended.

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

Use `class="tHeader"` on any column header that should be sortable.

For sorting, Sheetsee removes spaces and punctuation from the header text and uses the result as the data key. For example, `Place Name` sorts by `PlaceName`.

## 3. Prepare data

Sheetsee expects an array of objects. The keys should match the sortable header names after spaces are removed.

```js
var data = [
  {
    City: "Oakland",
    PlaceName: "Lake Merritt",
    Year: "1870",
    Image: "lake.jpg"
  },
  {
    City: "San Francisco",
    PlaceName: "Sutro Baths",
    Year: "1896",
    Image: "sutro.jpg"
  }
]
```

If the data comes from Tabletop.js or another spreadsheet loader, call Sheetsee after that loader has returned the rows.

## 4. Build the table

Call `Sheetsee.makeTable()` after the DOM and data are ready. Call `Sheetsee.initiateTableFilter()` if you added a filter input.

```html
<script>
  document.addEventListener("DOMContentLoaded", function () {
    var tableOptions = {
      data: data,
      pagination: 10,
      tableDiv: "#siteTable",
      filterDiv: "#siteTableFilter",
      templateID: "siteTable_template"
    }

    Sheetsee.makeTable(tableOptions)
    Sheetsee.initiateTableFilter(tableOptions)
  })
</script>
```

If `templateID` is omitted, Sheetsee looks for `siteTable_template` because `tableDiv` is `#siteTable`.

## 5. Test locally

The repository includes a working browser demo in `test/index.html`.

```bash
npm install
npm run bfy
```

Then open `test/index.html` in a browser. The demo should let you filter by `cat`, clear the filter, sort by `Rating`, and move between pages.

## Troubleshooting

- Blank table: confirm the template id matches `templateID`, or matches `tableDiv` plus `_template`.
- Sorting error: confirm each sortable header maps to a real data key, such as `Place Name` -> `PlaceName`.
- Clear button does nothing: confirm the link uses `class="clear"`.
- Filter does nothing: confirm `filterDiv` includes the hash, for example `#siteTableFilter`.
