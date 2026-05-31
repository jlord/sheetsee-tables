[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

# sheetsee-tables

Sheetsee.js uses this module to build sortable, searchable, and paginated
tables from spreadsheet-style data.

You need three things:

1. A placeholder `<div>` where the table will be rendered.
2. A Mustache template that describes the table markup.
3. A script that passes your data and table options to Sheetsee.

## Step-by-step table setup

This example uses local data so you can verify the table before connecting a
spreadsheet.

### 1. Add the scripts

Load the browser bundle and a file that creates a `data` array:

```html
<script src="./sheetsee.js"></script>
<script src="./data.js"></script>
```

Your `data.js` file should expose an array of objects:

```javascript
var data = [
  {
    "Animal": "Cat",
    "Name": "Liza",
    "Rating": "10"
  },
  {
    "Animal": "Dog",
    "Name": "Boo",
    "Rating": "9"
  }
]
```

When using Tabletop.js or another spreadsheet loader, pass the rows returned by
that loader as the `data` option instead.

### 2. Add a filter input and table placeholder

The filter input is optional. If you use one, its `id` must match the
`filterDiv` option in your script. The clear link must use the `clear` class.

```html
<input id="siteTableFilter" type="text" placeholder="filter by...">
<a href="#" class="clear">Clear</a>
<div id="siteTable"></div>
```

### 3. Add a Mustache table template

By default, Sheetsee expects the template id to be the placeholder id plus
`_template`. For a placeholder named `siteTable`, the default template id is
`siteTable_template`.

```html
<script id="siteTable_template" type="text/html">
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

Use `class="tHeader"` on sortable column headers. The text inside each sortable
header is converted into a data key by removing spaces and punctuation, so
`Place Name` sorts by `PlaceName`.

For sorting to work, the data key must match that converted header text. For
example:

- Data key: `PlaceName`
- Working table header: `Place Name`
- Non-working table headers: `PLACENAME`, `placename`

### 4. Build the table

Pass the same ids into `tableOptions`, including the leading `#` for
`tableDiv` and `filterDiv`.

```html
<script>
  document.addEventListener('DOMContentLoaded', function () {
    var tableOptions = {
      "data": data,
      "pagination": 10,
      "tableDiv": "#siteTable",
      "filterDiv": "#siteTableFilter"
    }

    Sheetsee.makeTable(tableOptions)
    Sheetsee.initiateTableFilter(tableOptions)
  })
</script>
```

If you use a custom template id instead of the default `siteTable_template`, add
`templateID`:

```javascript
var tableOptions = {
  "data": data,
  "pagination": 10,
  "tableDiv": "#siteTable",
  "filterDiv": "#siteTableFilter",
  "templateID": "customTemplate"
}
```

## Complete working example

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Sheetsee table example</title>
    <script src="./sheetsee.js"></script>
    <script src="./data.js"></script>
  </head>
  <body>
    <input id="siteTableFilter" type="text" placeholder="filter by...">
    <a href="#" class="clear">Clear</a>
    <div id="siteTable"></div>

    <script id="siteTable_template" type="text/html">
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

    <script>
      document.addEventListener('DOMContentLoaded', function () {
        var tableOptions = {
          "data": data,
          "pagination": 10,
          "tableDiv": "#siteTable",
          "filterDiv": "#siteTableFilter"
        }

        Sheetsee.makeTable(tableOptions)
        Sheetsee.initiateTableFilter(tableOptions)
      })
    </script>
  </body>
</html>
```

## Methods

### `Sheetsee.makeTable(tableOptions)`

Builds the table. `tableOptions` can include:

- `data` array: your row data. Required.
- `pagination` number: how many rows to display at one time. Defaults to all
  rows when omitted.
- `tableDiv` string: the placeholder `<div>` id, including the leading `#`.
  Required.
- `filterDiv` string: the filter `<input>` id, including the leading `#`.
  Required only when using `Sheetsee.initiateTableFilter()`.
- `templateID` string: the id of the Mustache template. Defaults to the table
  div id plus `_template`.

```javascript
var tableOptions = {
  "data": data,
  "pagination": 10,
  "tableDiv": "#fullTable",
  "filterDiv": "#fullTableFilter",
  "templateID": "fullTable_template"
}

Sheetsee.makeTable(tableOptions)
```

### `Sheetsee.initiateTableFilter(tableOptions)`

Adds search/filter behavior to an existing table. The page must include:

- An `<input>` whose id matches `filterDiv`.
- A clear link or button with `class="clear"`.

```html
<input id="tableFilter" type="text" placeholder="filter by...">
<a href="#" class="clear">Clear</a>
```

```javascript
Sheetsee.initiateTableFilter(tableOptions)
```

## Pagination markup

When `pagination` is set, Sheetsee appends pagination controls to the table
placeholder. You can style these selectors:

```css
#Pagination {}
.pagination-next {}
.pagination-pre {}
.no-pag {}
```

## Troubleshooting

- The table does not appear: check that `tableDiv` matches an existing
  placeholder id and that the template id exists.
- Sorting fails: check that each sortable header maps to a key in your row
  objects after spaces and punctuation are removed.
- Filtering does nothing: check that the filter input id matches `filterDiv`
  and that the clear control uses `class="clear"`, not `class=".clear"`.
- The default template is not found: either name it `yourTableId_template` or
  set `templateID` explicitly.

_[View Demo](http://jlord.us/sheetsee.js/demos/demo-table.html)_
_[Visit Site](http://jlord.us/sheetsee.js)_
