# Sheetsee-Tables: Step-by-Step Guide

A complete, working guide to creating sortable, searchable, paginated HTML tables from your data using **sheetsee-tables**.

> **Why this guide?** The hosted demos at jlord.us/sheetsee.js no longer work.
> This guide provides verified, copy-paste-ready examples you can run locally.

---

## Table of Contents

1. [What is sheetsee-tables?](#1-what-is-sheetsee-tables)
2. [Prerequisites](#2-prerequisites)
3. [Installation](#3-installation)
4. [Quick Start](#4-quick-start)
5. [Step-by-Step Tutorial](#5-step-by-step-tutorial)
   - [Step 1: Create an HTML File](#step-1-create-an-html-file)
   - [Step 2: Add the HTML Placeholder](#step-2-add-the-html-placeholder)
   - [Step 3: Create a Mustache Template](#step-3-create-a-mustache-template)
   - [Step 4: Add the JavaScript](#step-4-add-the-javascript)
   - [Step 5: Add Styling](#step-5-add-styling)
6. [Using with a Google Spreadsheet](#6-using-with-a-google-spreadsheet)
7. [Advanced Features](#7-advanced-features)
   - [Pagination](#pagination)
   - [Search / Filter](#search--filter)
   - [Sorting](#sorting)
8. [Full Working Examples](#8-full-working-examples)
   - [Example 1: Basic Table (No Spreadsheet)](#example-1-basic-table-no-spreadsheet)
   - [Example 2: Table with Pagination](#example-2-table-with-pagination)
   - [Example 3: Table with Filter and Pagination](#example-3-table-with-filter-and-pagination)
   - [Example 4: Table from Google Spreadsheet](#example-4-table-from-google-spreadsheet)
9. [API Reference](#9-api-reference)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. What is sheetsee-tables?

**sheetsee-tables** is a JavaScript module that creates interactive HTML tables with:

- **Sorting** – click column headers to sort ascending/descending
- **Filtering** – type in a search box to filter rows
- **Pagination** – navigate through large datasets page by page

It uses [Mustache.js](https://mustache.github.io) templates to define table structure and works with [Tabletop.js](https://github.com/jsoma/tabletop) to pull data from Google Spreadsheets.

It is part of the [sheetsee.js](https://github.com/jlord/sheetsee.js) ecosystem created by [Jessica Lord](https://github.com/jlord).

---

## 2. Prerequisites

- **Node.js** (v10 or later) and **npm**
- A text editor (VS Code, Sublime Text, etc.)
- A web browser (Chrome, Firefox, etc.)
- (Optional) A Google Spreadsheet for live data

---

## 3. Installation

### Option A: Install via npm (for Browserify projects)

```bash
mkdir my-sheetsee-table
cd my-sheetsee-table
npm init -y
npm install sheetsee-tables
```

### Option B: Use the pre-built bundle

If you don't want to use Browserify, you can use the test bundle:

```bash
git clone https://github.com/jlord/sheetsee-tables.git
cd sheetsee-tables
npm install
npm run bfy
# Now use test/sheetsee.js in your HTML
```

### Option C: Use the browserify setup script

The repo includes `test/set.js` which wraps the module for browser use. Running `npm run bfy` produces `test/sheetsee.js` that you can include directly.

---

## 4. Quick Start

The minimum needed to create a table:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>My Table</title>
  <!-- Include the sheetsee bundle -->
  <script src="sheetsee.js"></script>
  <!-- Include your data -->
  <script src="data.js"></script>
</head>
<body>

  <!-- 1. Placeholder div where the table renders -->
  <div id="myTable"></div>

  <!-- 2. Mustache template (id must match tableDiv + "_template") -->
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

  <!-- 3. Script to build the table -->
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      var tableOptions = {
        "data": data,
        "tableDiv": "#myTable"
      };
      Sheetsee.makeTable(tableOptions);
    });
  </script>

</body>
</html>
```

---

## 5. Step-by-Step Tutorial

### Step 1: Create an HTML File

Create a new file called `index.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Sheetsee Table Demo</title>
</head>
<body>

</body>
</html>
```

### Step 2: Add the HTML Placeholder

Add an empty `<div>` where you want the table to appear. Give it an `id`:

```html
<div id="animalTable"></div>
```

Also add a filter input (optional, for search functionality):

```html
<input id="animalTableFilter" type="text" placeholder="Filter by...">
<a href="#" class="clear">Clear</a>
<div id="animalTable"></div>
```

> **Important:** The "Clear" link MUST have the CSS class `clear` (not `.clear`).

### Step 3: Create a Mustache Template

Add a `<script>` tag with `type="text/html"` containing your template. The template `id` **must** follow the convention: `{tableDiv_id}_template`.

Since our div is `id="animalTable"`, the template id must be `animalTable_template`:

```html
<script id="animalTable_template" type="text/html">
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

**Key rules for templates:**

- Column headers with `class="tHeader"` enable click-to-sort
- The header text (e.g., "Animal") must **match the data field name's capitalization** exactly
  - Data field: `"Animal"` → Header: `Animal` or `animal` works, but the template references `{{Animal}}`
  - You can have spaces in headers: `"Place Name"` is fine, but data field must be `"PlaceName"` (no spaces)
- `{{#rows}}...{{/rows}}` loops over each data row
- `{{FieldName}}` inside the loop outputs that field's value

### Step 4: Add the JavaScript

Include your data file and the sheetsee bundle, then call `Sheetsee.makeTable()`:

```html
<script src="sheetsee.js"></script>
<script src="data.js"></script>

<script>
document.addEventListener('DOMContentLoaded', function() {
  var tableOptions = {
    "data": data,
    "tableDiv": "#animalTable"
  };
  Sheetsee.makeTable(tableOptions);
});
</script>
```

### Step 5: Add Styling

Add CSS to make headers clickable and pagination look nice:

```html
<style>
  body {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    padding: 40px;
  }
  .tHeader {
    cursor: pointer;
    text-align: left;
  }
  .tHeader::after {
    content: " ⇅";
    font-size: 10px;
    padding-left: 3px;
  }
  #Pagination {
    border-top: 2px solid #ddd;
    margin-top: 10px;
    padding-top: 10px;
  }
  #Pagination a {
    cursor: pointer;
    margin: 0 5px;
  }
  .no-pag {
    color: #ccc;
    pointer-events: none;
  }
  input {
    border: none;
    border-bottom: 1px solid #333;
    margin-bottom: 10px;
    padding: 5px;
    width: 200px;
  }
  .clear {
    margin-left: 10px;
    text-decoration: underline;
    cursor: pointer;
  }
</style>
```

---

## 6. Using with a Google Spreadsheet

To pull live data from a Google Spreadsheet, you need [Tabletop.js](https://github.com/jsoma/tabletop).

### Step 1: Make your Spreadsheet public

In Google Sheets: **File → Share → Publish to the web → Publish**

Your spreadsheet URL will look like:
`https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/edit`

### Step 2: Include Tabletop.js

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/tabletop.js/1.5.0/tabletop.min.js"></script>
<script src="sheetsee.js"></script>
```

### Step 3: Initialize Tabletop and build the table

```html
<script>
document.addEventListener('DOMContentLoaded', function() {
  var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit';

  function init(data) {
    var tabletopData = data.yourSheetName.elements; // 'yourSheetName' matches the tab name

    var tableOptions = {
      "data": tabletopData,
      "pagination": 10,
      "tableDiv": "#myTable"
    };

    Sheetsee.makeTable(tableOptions);
    Sheetsee.initiateTableFilter(tableOptions);
  }

  Tabletop.init({
    key: publicSpreadsheetUrl,
    callback: init,
    simpleSheet: true
  });
});
</script>
```

> **Note:** Replace `yourSheetName` with the actual name of your spreadsheet tab.
> The `simpleSheet: true` option returns data in a flat array format.

---

## 7. Advanced Features

### Pagination

Display a limited number of rows per page:

```javascript
var tableOptions = {
  "data": data,
  "pagination": 10,      // Show 10 rows per page
  "tableDiv": "#myTable"
};
Sheetsee.makeTable(tableOptions);
```

If you omit `pagination`, all rows display at once.

Add pagination HTML and CSS for navigation:

```html
<div id="Pagination" class="table-pagination"></div>
```

```css
#Pagination {
  border-top: 4px solid #CCF4FF;
  margin: 10px 0;
  padding-top: 10px;
  display: inline-block;
}
#Pagination a { cursor: pointer; }
.no-pag { color: #acacac; }
```

### Search / Filter

Add a text input and wire it up:

```html
<input id="myTableFilter" type="text" placeholder="Filter by...">
<a href="#" class="clear">Clear</a>
<div id="myTable"></div>
```

```javascript
var tableOptions = {
  "data": data,
  "pagination": 10,
  "tableDiv": "#myTable",
  "filterDiv": "#myTableFilter"
};
Sheetsee.makeTable(tableOptions);
Sheetsee.initiateTableFilter(tableOptions);
```

> **Important:** The `filterDiv` value must include the `#` prefix.
> The clear button must have `class="clear"`.

### Sorting

Add `class="tHeader"` to your `<th>` elements in the template:

```html
<th class="tHeader">Name</th>
<th class="tHeader">City</th>
<th class="tHeader">Rating</th>
```

Sorting happens automatically when you click a header. No extra JavaScript needed.

---

## 8. Full Working Examples

### Example 1: Basic Table (No Spreadsheet)

**data.js:**
```javascript
var data = [
  { "Animal": "Cat",  "Name": "Liza",    "Rating": "10" },
  { "Animal": "Dog",  "Name": "Boo",     "Rating": "9" },
  { "Animal": "Dog",  "Name": "Sam",     "Rating": "10" },
  { "Animal": "Cat",  "Name": "Snowy",   "Rating": "4" },
  { "Animal": "Cat",  "Name": "Trisana", "Rating": "7" }
];
```

**index.html:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Basic Table</title>
  <script src="sheetsee.js"></script>
  <script src="data.js"></script>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; }
    .tHeader { cursor: pointer; }
    .tHeader::after { content: " ⇅"; font-size: 10px; }
    table { border-collapse: collapse; width: 100%; }
    td, th { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <h1>Animal Ratings</h1>
  <div id="animalTable"></div>

  <script id="animalTable_template" type="text/html">
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
    document.addEventListener('DOMContentLoaded', function() {
      Sheetsee.makeTable({ "data": data, "tableDiv": "#animalTable" });
    });
  </script>
</body>
</html>
```

### Example 2: Table with Pagination

Same as Example 1, but add pagination:

```javascript
Sheetsee.makeTable({
  "data": data,
  "pagination": 3,
  "tableDiv": "#animalTable"
});
```

Add this CSS for the pagination controls:

```css
#Pagination { margin-top: 10px; padding-top: 10px; border-top: 2px solid #ccc; }
#Pagination a { cursor: pointer; margin: 0 5px; }
.no-pag { color: #ccc; pointer-events: none; }
```

### Example 3: Table with Filter and Pagination

**Full working HTML:**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Filterable Table</title>
  <script src="sheetsee.js"></script>
  <script src="data.js"></script>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; }
    .tHeader { cursor: pointer; }
    .tHeader::after { content: " ⇅"; font-size: 10px; }
    table { border-collapse: collapse; width: 100%; }
    td, th { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    input { border: none; border-bottom: 1px solid #333; margin: 10px 0; padding: 5px; width: 200px; }
    .clear { margin-left: 10px; text-decoration: underline; cursor: pointer; }
    #Pagination { margin-top: 10px; padding-top: 10px; border-top: 2px solid #ccc; }
    #Pagination a { cursor: pointer; margin: 0 5px; }
    .no-pag { color: #ccc; pointer-events: none; }
  </style>
</head>
<body>
  <h1>Animal Ratings</h1>
  <input id="animalTableFilter" type="text" placeholder="Filter by...">
  <a href="#" class="clear">Clear</a>
  <div id="animalTable"></div>

  <script id="animalTable_template" type="text/html">
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
    document.addEventListener('DOMContentLoaded', function() {
      var tableOptions = {
        "data": data,
        "pagination": 2,
        "tableDiv": "#animalTable",
        "filterDiv": "#animalTableFilter"
      };
      Sheetsee.makeTable(tableOptions);
      Sheetsee.initiateTableFilter(tableOptions);
    });
  </script>
</body>
</html>
```

### Example 4: Table from Google Spreadsheet

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Google Spreadsheet Table</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/tabletop.js/1.5.0/tabletop.min.js"></script>
  <script src="sheetsee.js"></script>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; }
    .tHeader { cursor: pointer; }
    .tHeader::after { content: " ⇅"; font-size: 10px; }
    table { border-collapse: collapse; width: 100%; }
    td, th { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    input { border: none; border-bottom: 1px solid #333; margin: 10px 0; padding: 5px; width: 200px; }
    .clear { margin-left: 10px; text-decoration: underline; cursor: pointer; }
  </style>
</head>
<body>
  <h1>My Spreadsheet Data</h1>
  <input id="sheetTableFilter" type="text" placeholder="Filter by...">
  <a href="#" class="clear">Clear</a>
  <div id="sheetTable"></div>

  <script id="sheetTable_template" type="text/html">
    <table>
      <tr>
        <th class="tHeader">Name</th>
        <th class="tHeader">City</th>
        <th class="tHeader">Year</th>
      </tr>
      {{#rows}}
      <tr>
        <td>{{name}}</td>
        <td>{{city}}</td>
        <td>{{year}}</td>
      </tr>
      {{/rows}}
    </table>
  </script>

  <script>
    function init(tabletop) {
      var data = tabletop.sheets("Sheet1").all();
      // Tabletop returns data with header names as keys

      var tableOptions = {
        "data": data,
        "pagination": 10,
        "tableDiv": "#sheetTable",
        "filterDiv": "#sheetTableFilter"
      };
      Sheetsee.makeTable(tableOptions);
      Sheetsee.initiateTableFilter(tableOptions);
    }

    Tabletop.init({
      key: 'YOUR_SPREADSHEET_ID_HERE',
      callback: init,
      simpleSheet: true
    });
  </script>
</body>
</html>
```

**Setup steps for Google Spreadsheet:**

1. Create a Google Spreadsheet with headers in the first row
2. Go to **File → Share → Publish to web → Publish**
3. Copy the spreadsheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/`**SPREADSHEET_ID**`/edit`
4. Replace `YOUR_SPREADSHEET_ID_HERE` in the code above
5. Make sure the sheet tab name matches what you pass to `tabletop.sheets("Sheet1")`
6. **Important:** Your data field names in the Mustache template must match your spreadsheet column headers exactly (case-sensitive)

---

## 9. API Reference

### `Sheetsee.makeTable(tableOptions)`

Creates and renders a table.

| Option      | Type     | Required | Description                                                    |
|-------------|----------|----------|----------------------------------------------------------------|
| `data`      | Array    | Yes      | Array of objects from Tabletop.js or your own data             |
| `tableDiv`  | String   | Yes      | CSS selector for the placeholder div (e.g., `"#myTable"`)     |
| `pagination`| Number   | No       | Rows per page. Omit to show all rows                          |
| `filterDiv` | String   | No       | CSS selector for the filter input (e.g., `"#myTableFilter"`)  |
| `templateID`| String   | No       | ID of the template script tag. Defaults to `{tableDiv}_template` |

### `Sheetsee.initiateTableFilter(tableOptions)`

Enables search/filter on the table. Must be called after `makeTable()`.

Requires:
- A `filterDiv` in the options
- An `<input>` element with the matching id
- A `<a class="clear">` element to reset the filter

---

## 10. Troubleshooting

### Table doesn't appear

| Problem | Solution |
|---------|----------|
| Nothing renders | Make sure `Sheetsee.makeTable()` is called **after** the DOM is ready. Wrap it in `DOMContentLoaded` event listener. |
| Data is undefined | Check that your `data.js` file is included **before** your script that calls `makeTable()`, and that it defines a `data` variable. |
| Console error: `Cannot read property 'innerHTML'` | The template script tag is missing or its id doesn't match `tableDiv` + `_template`. |

### Template ID mismatch

**The most common bug.** The template script tag `id` must be `{tableDiv_id}_template`.

```
tableDiv: "#animalTable"  →  template id must be "animalTable_template"
tableDiv: "#siteTable"    →  template id must be "siteTable_template"
```

Wrong:
```html
<div id="myTable"></div>
<script id="tableTemplate" type="text/html">...</script>  <!-- WRONG -->
```

Correct:
```html
<div id="myTable"></div>
<script id="myTable_template" type="text/html">...</script>  <!-- CORRECT -->
```

### Data field names don't match template

The `{{FieldName}}` in your template must **exactly match** the keys in your data objects (case-sensitive).

If your data is:
```javascript
var data = [{ "Animal": "Cat", "Name": "Liza" }];
```

Template must use `{{Animal}}` and `{{Name}}`, NOT `{{animal}}` or `{{name}}`.

### Sorting doesn't work

- Table headers must have `class="tHeader"` (capital H, capital T)
- The header text must match the data field name (e.g., header says "Animal", data key is "Animal")

### Filter / Clear doesn't work

- The clear button must have **`class="clear"`** (not `class=".clear"` — no dot in the attribute)
- The `filterDiv` option must include the `#` prefix: `"#myTableFilter"` not `"myTableFilter"`

### Pagination doesn't appear

- You must specify the `pagination` option with a number
- The number should be less than the total number of rows

### Hosted demos at jlord.us/sheetsee.js don't work

The hosted demos are no longer maintained. Use the local setup described in this guide instead:

```bash
git clone https://github.com/jlord/sheetsee-tables.git
cd sheetsee-tables
npm install
npm run bfy
# Open test/index.html in your browser
```

### Google Spreadsheet shows no data

- Make sure the spreadsheet is published (File → Share → Publish to web)
- Make sure `simpleSheet: true` is set in Tabletop options
- Check that the sheet tab name in `tabletop.sheets("Sheet1")` matches your actual tab name
- Open browser console to check for CORS or network errors

### Mustache template shows raw `{{field}}` text

This means the template isn't being processed. Common causes:
- `sheetsee.js` isn't loaded before your script runs
- The template script tag doesn't have `type="text/html"`
- The `templateID` doesn't match the template element's id

---

## License

BSD-2-Clause. See [LICENSE](LICENSE) for details.
