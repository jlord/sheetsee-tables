[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

# sheetsee-tables

Sheetsee.js uses this module to make tables. With this module you can create tables with your spreadsheet data that are **sortable**, **searchable** and **paginated**.

> **New here?** See the [Step-by-Step Guide](STEP_BY_STEP.md) for a complete tutorial with working examples, or read the [Quick Start](#quick-start) below.

## Quick Start

### 1. Install

```bash
npm install sheetsee-tables
```

### 2. Set up your HTML

You need three things: a **placeholder div**, a **Mustache template**, and a **script** to build the table.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>My Table</title>
  <script src="sheetsee.js"></script>
  <script src="data.js"></script>
</head>
<body>

  <!-- Placeholder: empty div with an id -->
  <div id="myTable"></div>

  <!-- Template: mustache template with id = "{divId}_template" -->
  <script id="myTable_template" type="text/html">
    <table>
      <tr>
        <th class="tHeader">Name</th>
        <th class="tHeader">City</th>
        <th class="tHeader">Rating</th>
      </tr>
      {{#rows}}
      <tr>
        <td>{{Name}}</td>
        <td>{{City}}</td>
        <td>{{Rating}}</td>
      </tr>
      {{/rows}}
    </table>
  </script>

  <!-- Script: build the table -->
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      Sheetsee.makeTable({
        "data": data,
        "tableDiv": "#myTable"
      });
    });
  </script>

</body>
</html>
```

### 3. Create your data file

**data.js:**
```javascript
var data = [
  { "Name": "Alice", "City": "Portland", "Rating": "9" },
  { "Name": "Bob",   "City": "Seattle",  "Rating": "7" },
  { "Name": "Carol", "City": "Denver",   "Rating": "8" }
];
```

### 4. Run locally

```bash
npx serve .
# Open http://localhost:3000
```

---

## Template Rules

- **Template id** must be `{tableDiv_id}_template` (e.g., div `#siteTable` → template `siteTable_template`)
- **Column headers** with `class="tHeader"` enable click-to-sort
- Header text must **match the capitalization** of your data field names
  - Data key: `PlaceName` → Header: `Place Name` ✓
  - Data key: `PlaceName` → Header: `PLACENAME` ✗
- `{{#rows}}...{{/rows}}` loops over each data row
- `{{FieldName}}` outputs that field's value

## Methods

### `Sheetsee.makeTable(options)`

| Option      | Type     | Required | Description                                              |
|-------------|----------|----------|----------------------------------------------------------|
| `data`      | Array    | Yes      | Array of row objects                                     |
| `tableDiv`  | String   | Yes      | CSS selector for the placeholder div (includes `#`)      |
| `pagination`| Number   | No       | Rows per page (omit to show all)                        |
| `filterDiv` | String   | No       | CSS selector for the filter input (includes `#`)         |
| `templateID`| String   | No       | Template script tag id (defaults to `{tableDiv}_template`) |

```javascript
var tableOptions = {
  "data": data,
  "pagination": 10,
  "tableDiv": "#fullTable",
  "filterDiv": "#fullTableFilter",
  "templateID": "fullTable_template"
};
Sheetsee.makeTable(tableOptions);
```

### `Sheetsee.initiateTableFilter(options)`

Enables search/filter on the table. Requires a `filterDiv` in options.

**HTML needed:**
```html
<input id="myTableFilter" type="text" placeholder="Filter by...">
<a href="#" class="clear">Clear</a>
```

> **Important:** The clear link must use `class="clear"` (not `class=".clear"`).

```javascript
Sheetsee.initiateTableFilter(tableOptions);
```

## Pagination

Add the `pagination` option to limit rows per page:

```javascript
Sheetsee.makeTable({ "data": data, "pagination": 10, "tableDiv": "#myTable" });
```

Style the pagination controls:

```css
#Pagination { border-top: 2px solid #ddd; margin-top: 10px; padding-top: 10px; }
#Pagination a { cursor: pointer; margin: 0 5px; }
.no-pag { color: #ccc; pointer-events: none; }
```

## Sorting

Add `class="tHeader"` to `<th>` elements in your template. Clicking a header sorts that column ascending/descending.

## Using with Google Spreadsheets

See the [Step-by-Step Guide §6](STEP_BY_STEP.md#6-using-with-a-google-spreadsheet) for a complete walkthrough with [Tabletop.js](https://github.com/jsoma/tabletop).

## Examples

See the [Step-by-Step Guide §8](STEP_BY_STEP.md#8-full-working-examples) for four complete, copy-paste-ready examples:

1. Basic table (no spreadsheet)
2. Table with pagination
3. Table with filter and pagination
4. Table from Google Spreadsheet

## Testing

```bash
# Browserify the test bundle
npm run bfy

# Open test/index.html in your browser
open test/index.html
```

## [Full Documentation](STEP_BY_STEP.md)

Includes installation, tutorials, API reference, and troubleshooting.

## License

BSD-2-Clause
