# Spreadsheet to Table Manual

This guide shows the complete path from spreadsheet-shaped data to a working Sheetsee table. It avoids relying on the old hosted demo and uses the local test page included in this repository.

## 1. Prepare row data

Sheetsee tables expect an array of objects. Each object is one spreadsheet row, and each key is a column name.

```javascript
var data = [
  {Animal: 'Cat', Name: 'Liza', Rating: '10'},
  {Animal: 'Dog', Name: 'Boo', Rating: '9'},
  {Animal: 'Cat', Name: 'Snowy', Rating: '4'}
]
```

If you use a spreadsheet loader such as Tabletop.js, pass the rows returned by that loader as `data`.

## 2. Add the table target

Create a filter input, a clear link and the empty element where the table should be rendered.

```html
<input id="fullTableFilter" type="text" placeholder="filter by..">
<a href="#" class="clear">Clear</a>
<div id="fullTable"></div>
```

The clear link must use `class="clear"`. Do not include a dot in the class attribute.

## 3. Add a Mustache template

The template controls the table markup. Header cells with `class="tHeader"` become sortable.

```html
<script id="fullTable_template" type="text/html">
  <table>
    <tr>
      <th class="tHeader">Animal</th>
      <th class="tHeader">Name</th>
      <th class="tHeader">Rating</th>
    </tr>
    {{#rows}}
      <tr>
        <td>{{Animal}}</td>
        <td>{{Name}}</td>
        <td>{{Rating}}</td>
      </tr>
    {{/rows}}
  </table>
</script>
```

The values inside `{{ }}` must match the row object keys exactly.

## 4. Build the table

Pass the same element IDs into the Sheetsee options.

```html
<script>
document.addEventListener('DOMContentLoaded', function () {
  var tableOptions = {
    data: data,
    pagination: 2,
    tableDiv: '#fullTable',
    filterDiv: '#fullTableFilter',
    templateID: 'fullTable_template'
  }

  Sheetsee.makeTable(tableOptions)
  Sheetsee.initiateTableFilter(tableOptions)
})
</script>
```

`templateID` is optional only when the template ID is the table div ID plus `_template`. For clarity, the example sets it explicitly.

## 5. Run the local demo

Install dependencies and build the browser bundle:

```bash
npm install
npm run bfy
```

Open `test/index.html` in a browser.

Expected checks:

- the table renders with two rows per page
- typing `cat` filters to the cat rows
- clicking `Rating` sorts the current rows
- `Previous` and `Next` move through paginated rows
- `Clear` empties the filter and restores all rows

## Troubleshooting

- Blank table: confirm `tableDiv` points to an existing element, including the `#`.
- Template not found: confirm `templateID` matches the template script ID exactly.
- Filter does nothing: confirm `filterDiv` points to the input and the clear link uses `class="clear"`.
- Sort does nothing: confirm sortable headers use `class="tHeader"`.
- Empty cells: confirm template placeholders match the data keys exactly, including capitalization.
