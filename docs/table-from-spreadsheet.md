# Create a table from spreadsheet data

This guide shows the smallest complete path from spreadsheet-shaped data to
a searchable, sortable, paginated table with `sheetsee-tables`.

It uses a local JavaScript array first so you can confirm the table setup
works before adding a live spreadsheet loader such as Tabletop.js.

## What this guide covers

- Preparing spreadsheet data with clear column names.
- Adding the table placeholder and optional filter input.
- Writing the Mustache table template.
- Configuring `Sheetsee.makeTable()`.
- Enabling search, sorting, and pagination.
- Troubleshooting the most common setup mistakes.

## 1. Prepare the spreadsheet

Your first row should contain column names. Keep the names short and avoid
spaces in the spreadsheet header row.

Example columns:

```text
City,PlaceName,Year
Oakland,Grand Lake Theater,1926
Portland,Hollywood Theatre,1926
Chicago,Music Box Theatre,1929
```

If you load data from a spreadsheet service, make sure the spreadsheet is
publicly readable before trying to render it in the browser.

## 2. Add the HTML placeholder

Add an empty element where the table should be rendered:

```html
<div id="siteTable"></div>
```

The `tableDiv` option must point to this element and include the `#` prefix.

## 3. Add a filter input

If you want search/filtering, add an input and a clear link:

```html
<input id="siteTableFilter" type="text" placeholder="filter by...">
<a href="#" class="clear">Clear</a>
```

The `filterDiv` option must point to the input and include the `#` prefix.

## 4. Add the Mustache table template

Add a template with one `{{#rows}}` block. Each field inside the block should
match a key in your data objects.

```html
<script id="tableTemplate" type="text/html">
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

Headers with the `tHeader` class can be clicked to sort the table. The header
text should match the spreadsheet column name after spaces and non-word
characters are removed. For example, `Place Name` maps to `PlaceName`.

## 5. Load spreadsheet-shaped data

This local example avoids any network dependency:

```html
<script>
  var data = [
    { City: "Oakland", PlaceName: "Grand Lake Theater", Year: "1926" },
    { City: "Portland", PlaceName: "Hollywood Theatre", Year: "1926" },
    { City: "Chicago", PlaceName: "Music Box Theatre", Year: "1929" }
  ]
</script>
```

When you switch to a live spreadsheet loader, pass the array returned by that
loader into the same `data` option shown below.

## 6. Configure tableOptions

```html
<script>
  var tableOptions = {
    data: data,
    pagination: 10,
    tableDiv: "#siteTable",
    filterDiv: "#siteTableFilter",
    templateID: "tableTemplate"
  }
</script>
```

Required options:

- `data`: an array of row objects.
- `tableDiv`: the table placeholder selector, including `#`.

Optional options:

- `pagination`: number of rows per page. Omit it to show all rows.
- `filterDiv`: the filter input selector, including `#`.
- `templateID`: the template element id. If omitted, Sheetsee assumes
  `tableDiv` without `#` plus `_template`.

## 7. Render the table

Call `Sheetsee.makeTable()` after the page has loaded and after your data is
available:

```html
<script>
  document.addEventListener("DOMContentLoaded", function () {
    Sheetsee.makeTable(tableOptions)
  })
</script>
```

## 8. Enable search/filter

If you added `filterDiv` and the `.clear` link, enable filtering after the
table is created:

```html
<script>
  document.addEventListener("DOMContentLoaded", function () {
    Sheetsee.makeTable(tableOptions)
    Sheetsee.initiateTableFilter(tableOptions)
  })
</script>
```

## 9. Optional: enable sorting

Sorting is enabled automatically when your template contains table headers
with the `tHeader` class:

```html
<th class="tHeader">City</th>
```

The header text is converted into a data key by removing spaces and non-word
characters. `Place Name` becomes `PlaceName`.

## 10. Optional: pagination

Set `pagination` to the number of rows per page:

```js
pagination: 10
```

Sheetsee adds pagination controls to the bottom of the table. You can style:

```css
#Pagination {}
.pagination-next {}
.pagination-pre {}
.no-pag {}
```

## Complete example

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Sheetsee table example</title>
    <script src="sheetsee.js"></script>
  </head>
  <body>
    <input id="siteTableFilter" type="text" placeholder="filter by...">
    <a href="#" class="clear">Clear</a>
    <div id="siteTable"></div>

    <script id="tableTemplate" type="text/html">
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

    <script>
      var data = [
        { City: "Oakland", PlaceName: "Grand Lake Theater", Year: "1926" },
        { City: "Portland", PlaceName: "Hollywood Theatre", Year: "1926" },
        { City: "Chicago", PlaceName: "Music Box Theatre", Year: "1929" }
      ]

      document.addEventListener("DOMContentLoaded", function () {
        var tableOptions = {
          data: data,
          pagination: 10,
          tableDiv: "#siteTable",
          filterDiv: "#siteTableFilter",
          templateID: "tableTemplate"
        }

        Sheetsee.makeTable(tableOptions)
        Sheetsee.initiateTableFilter(tableOptions)
      })
    </script>
  </body>
</html>
```

## Troubleshooting

If the table does not render:

- Confirm the template exists before `Sheetsee.makeTable()` runs.
- Confirm `tableDiv` includes `#` and points to an existing element.
- Confirm `templateID` matches the template element id exactly.
- Confirm `data` is an array of objects.
- Confirm the field names in `{{mustache}}` tags match the data keys.

If filtering does not work:

- Confirm `filterDiv` includes `#` and points to an input element.
- Confirm there is a `.clear` element in the page.
- Call `Sheetsee.initiateTableFilter(tableOptions)` after
  `Sheetsee.makeTable(tableOptions)`.

If sorting does not work:

- Confirm sortable headers use the `tHeader` class.
- Confirm header text maps to a data key after spaces are removed.
  `Place Name` maps to `PlaceName`.
- Confirm values in the sorted column are present for every row.

If a live spreadsheet example stays on a loading message:

- Check the browser console for JavaScript errors.
- Check the network tab for blocked or failed spreadsheet requests.
- Confirm the spreadsheet is published or publicly readable.
- Test with the local array example above to confirm the table template and
  options are correct before debugging the spreadsheet loader.
