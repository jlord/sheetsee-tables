# Sheetsee-Tables: Step-by-Step Manual

A complete guide to creating interactive tables with sorting, searching, and pagination using sheetsee-tables.

## Table of Contents

- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Basic Setup](#basic-setup)
- [Creating Your First Table](#creating-your-first-table)
- [Adding Sorting](#adding-sorting)
- [Adding Search/Filter](#adding-searchfilter)
- [Adding Pagination](#adding-pagination)
- [Complete Example](#complete-example)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)

## Quick Start

```bash
npm install sheetsee-tables
```

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Table</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/mustache.js/4.2.0/mustache.min.js"></script>
  <script src="node_modules/sheetsee-tables/index.js"></script>
</head>
<body>
  <div id="myTable"></div>
  
  <script id="myTable_template" type="text/template">
    <table>
      <tr>
        <th class="tHeader">Name</th>
        <th class="tHeader">Age</th>
      </tr>
      {{#data}}
      <tr>
        <td>{{Name}}</td>
        <td>{{Age}}</td>
      </tr>
      {{/data}}
    </table>
  </script>

  <script>
    var data = [
      { Name: "Alice", Age: 30 },
      { Name: "Bob", Age: 25 }
    ];
    
    Sheetsee.makeTable({
      data: data,
      tableDiv: "#myTable",
      pagination: 10
    });
  </script>
</body>
</html>
```

## Prerequisites

- Basic HTML/CSS/JavaScript knowledge
- A web browser (Chrome, Firefox, Safari, Edge)
- A text editor (VS Code, Sublime Text, etc.)
- Node.js (for npm installation)

## Installation

### Option 1: npm (Recommended)

```bash
npm install sheetsee-tables
```

### Option 2: Download

1. Download `index.js` from the repository
2. Include it in your HTML:

```html
<script src="path/to/index.js"></script>
```

### Option 3: CDN (if available)

```html
<script src="https://unpkg.com/sheetsee-tables"></script>
```

## Basic Setup

### Step 1: Create HTML Structure

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Sheetsee Table</title>
  <!-- Mustache.js for templating -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/mustache.js/4.2.0/mustache.min.js"></script>
  <!-- Sheetsee-tables -->
  <script src="node_modules/sheetsee-tables/index.js"></script>
  <style>
    table {
      border-collapse: collapse;
      width: 100%;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
      cursor: pointer;
    }
    th:hover {
      background-color: #ddd;
    }
  </style>
</head>
<body>
  <!-- Table container -->
  <div id="myTable"></div>
  
  <!-- Template -->
  <script id="myTable_template" type="text/template">
    <!-- Template content here -->
  </script>
  
  <!-- Data and initialization -->
  <script>
    // Your data and initialization code here
  </script>
</body>
</html>
```

### Step 2: Prepare Your Data

Your data should be an array of objects. Each object represents a row.

```javascript
var myData = [
  { Name: "Alice", Age: 30, City: "New York" },
  { Name: "Bob", Age: 25, City: "San Francisco" },
  { Name: "Charlie", Age: 35, City: "Chicago" }
];
```

**Important:** 
- Use consistent property names (keys)
- Avoid spaces in property names
- Property names are case-sensitive

### Step 3: Create the Template

Templates use [Mustache.js](https://mustache.github.io) syntax.

```html
<script id="myTable_template" type="text/template">
  <table>
    <tr>
      <th class="tHeader">Name</th>
      <th class="tHeader">Age</th>
      <th class="tHeader">City</th>
    </tr>
    {{#data}}
    <tr>
      <td>{{Name}}</td>
      <td>{{Age}}</td>
      <td>{{City}}</td>
    </tr>
    {{/data}}
  </table>
</script>
```

**Template Rules:**
- `{{#data}}...{{/data}}` loops through your data array
- `{{PropertyName}}` displays the value of that property
- Use `class="tHeader"` on `<th>` elements for sorting
- Template `id` must match `tableDiv` + `_template`

## Creating Your First Table

### Step 1: HTML Placeholder

```html
<div id="myTable"></div>
```

### Step 2: Template

```html
<script id="myTable_template" type="text/template">
  <table>
    <tr>
      <th class="tHeader">Name</th>
      <th class="tHeader">Age</th>
    </tr>
    {{#data}}
    <tr>
      <td>{{Name}}</td>
      <td>{{Age}}</td>
    </tr>
    {{/data}}
  </table>
</script>
```

### Step 3: Initialize Table

```javascript
var data = [
  { Name: "Alice", Age: 30 },
  { Name: "Bob", Age: 25 }
];

Sheetsee.makeTable({
  data: data,
  tableDiv: "#myTable",
  pagination: 10
});
```

## Adding Sorting

Sorting is automatic when you use `class="tHeader"` on your table headers.

### How Sorting Works

1. Click a column header to sort ascending
2. Click again to sort descending
3. Click again to toggle back to ascending

### Requirements

- Table headers must have `class="tHeader"`
- Header text must match spreadsheet column names (case-insensitive, but capitalization must match)
- Spaces in headers are OK, but avoid spaces in column names

### Example

```html
<script id="myTable_template" type="text/template">
  <table>
    <tr>
      <th class="tHeader">Name</th>
      <th class="tHeader">Age</th>
      <th class="tHeader">City</th>
    </tr>
    {{#data}}
    <tr>
      <td>{{Name}}</td>
      <td>{{Age}}</td>
      <td>{{City}}</td>
    </tr>
    {{/data}}
  </table>
</script>
```

## Adding Search/Filter

### Step 1: Add Search Input

```html
<div id="filterContainer">
  <input type="text" id="myFilter" placeholder="Search...">
  <button class="clear">Clear</button>
</div>
<div id="myTable"></div>
```

### Step 2: Initialize Filter

```javascript
Sheetsee.makeTable({
  data: data,
  tableDiv: "#myTable",
  filterDiv: "#myFilter",
  pagination: 10
});

// Initialize the filter
Sheetsee.initiateTableFilter({
  filterDiv: "#myFilter"
});
```

### Filter Features

- Searches all columns
- Case-insensitive
- Real-time filtering as you type
- Clear button resets the filter

## Adding Pagination

### Basic Pagination

```javascript
Sheetsee.makeTable({
  data: data,
  tableDiv: "#myTable",
  pagination: 10  // Show 10 rows per page
});
```

### Pagination Controls

Add pagination buttons to your template:

```html
<script id="myTable_template" type="text/template">
  <table>
    <tr>
      <th class="tHeader">Name</th>
      <th class="tHeader">Age</th>
    </tr>
    {{#data}}
    <tr>
      <td>{{Name}}</td>
      <td>{{Age}}</td>
    </tr>
    {{/data}}
  </table>
  
  <div class="pagination">
    <button class="prev">Previous</button>
    <button class="next">Next</button>
  </div>
</script>
```

## Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>Sheetsee-Tables Complete Example</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/mustache.js/4.2.0/mustache.min.js"></script>
  <script src="node_modules/sheetsee-tables/index.js"></script>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-top: 20px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    th {
      background-color: #4CAF50;
      color: white;
      cursor: pointer;
    }
    th:hover {
      background-color: #45a049;
    }
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    .filter-container {
      margin: 20px 0;
    }
    input[type="text"] {
      padding: 10px;
      width: 200px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    button {
      padding: 10px 20px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background-color: #45a049;
    }
  </style>
</head>
<body>
  <h1>Employee Directory</h1>
  
  <div class="filter-container">
    <input type="text" id="employeeFilter" placeholder="Search employees...">
    <button class="clear">Clear</button>
  </div>
  
  <div id="employeeTable"></div>
  
  <script id="employeeTable_template" type="text/template">
    <table>
      <tr>
        <th class="tHeader">Name</th>
        <th class="tHeader">Department</th>
        <th class="tHeader">Position</th>
        <th class="tHeader">Salary</th>
      </tr>
      {{#data}}
      <tr>
        <td>{{Name}}</td>
        <td>{{Department}}</td>
        <td>{{Position}}</td>
        <td>{{Salary}}</td>
      </tr>
      {{/data}}
    </table>
    
    <div class="pagination">
      <button class="prev">Previous</button>
      <button class="next">Next</button>
    </div>
  </script>

  <script>
    // Sample data
    var employees = [
      { Name: "Alice Johnson", Department: "Engineering", Position: "Senior Developer", Salary: "$120,000" },
      { Name: "Bob Smith", Department: "Marketing", Position: "Marketing Manager", Salary: "$95,000" },
      { Name: "Charlie Brown", Department: "Engineering", Position: "Junior Developer", Salary: "$75,000" },
      { Name: "Diana Prince", Department: "HR", Position: "HR Director", Salary: "$110,000" },
      { Name: "Eve Wilson", Department: "Engineering", Position: "Tech Lead", Salary: "$140,000" },
      { Name: "Frank Miller", Department: "Sales", Position: "Sales Manager", Salary: "$100,000" },
      { Name: "Grace Lee", Department: "Marketing", Position: "Content Writer", Salary: "$65,000" },
      { Name: "Henry Davis", Department: "Engineering", Position: "DevOps Engineer", Salary: "$115,000" },
      { Name: "Ivy Chen", Department: "HR", Position: "Recruiter", Salary: "$70,000" },
      { Name: "Jack Wilson", Department: "Sales", Position: "Sales Rep", Salary: "$80,000" }
    ];

    // Initialize table
    Sheetsee.makeTable({
      data: employees,
      tableDiv: "#employeeTable",
      filterDiv: "#employeeFilter",
      pagination: 5
    });

    // Initialize filter
    Sheetsee.initiateTableFilter({
      filterDiv: "#employeeFilter"
    });
  </script>
</body>
</html>
```

## API Reference

### `Sheetsee.makeTable(options)`

Creates and initializes a table.

**Parameters:**

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `data` | Array | Yes | Array of objects to display |
| `tableDiv` | String | Yes | CSS selector for table container (e.g., `"#myTable"`) |
| `pagination` | Number | No | Rows per page (defaults to all) |
| `filterDiv` | String | No | CSS selector for filter input |
| `templateID` | String | No | Template element ID (defaults to `tableDiv + "_template"`) |

**Example:**

```javascript
Sheetsee.makeTable({
  data: myData,
  tableDiv: "#myTable",
  pagination: 10,
  filterDiv: "#myFilter"
});
```

### `Sheetsee.initiateTableFilter(options)`

Initializes the search/filter functionality.

**Parameters:**

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `filterDiv` | String | Yes | CSS selector for filter input |

**Example:**

```javascript
Sheetsee.initiateTableFilter({
  filterDiv: "#myFilter"
});
```

## Troubleshooting

### Table not showing

1. **Check template ID:** Must match `tableDiv` + `_template`
   - `tableDiv: "#myTable"` → `id="myTable_template"`
   
2. **Check data format:** Must be array of objects
   ```javascript
   // Correct
   var data = [{ Name: "Alice" }, { Name: "Bob" }];
   
   // Wrong
   var data = { Name: "Alice" };
   ```

3. **Check script order:** Must include Mustache.js before sheetsee-tables

### Sorting not working

1. **Check header class:** Must be `class="tHeader"`
2. **Check header text:** Must match column names (case-insensitive)
3. **Check column names:** Avoid spaces in property names

### Search not working

1. **Check filter div:** Must be a valid CSS selector
2. **Check clear button:** Must have `class="clear"`
3. **Check input element:** Must be an `<input>` element

### Pagination not working

1. **Check pagination value:** Must be a positive number
2. **Check data length:** Must have more items than pagination value

### Data not displaying

1. **Check property names:** Must match template placeholders exactly
2. **Check data structure:** Must be array of objects
3. **Check console:** Look for JavaScript errors

## Tips and Best Practices

1. **Use consistent naming:** Keep property names consistent across all data objects
2. **Avoid special characters:** Don't use spaces or special characters in property names
3. **Test with sample data:** Start with a small dataset to verify functionality
4. **Style with CSS:** Use CSS to customize table appearance
5. **Mobile responsive:** Add CSS media queries for mobile devices

## Examples

### Basic Table

```javascript
var data = [
  { Name: "Alice", Age: 30 },
  { Name: "Bob", Age: 25 }
];

Sheetsee.makeTable({
  data: data,
  tableDiv: "#basicTable",
  pagination: 10
});
```

### Table with Search

```javascript
var data = [
  { Name: "Alice", Department: "Engineering" },
  { Name: "Bob", Department: "Marketing" }
];

Sheetsee.makeTable({
  data: data,
  tableDiv: "#searchTable",
  filterDiv: "#searchInput",
  pagination: 10
});

Sheetsee.initiateTableFilter({
  filterDiv: "#searchInput"
});
```

### Table with Custom Template

```javascript
var data = [
  { Product: "Widget", Price: "$10", Stock: 100 },
  { Product: "Gadget", Price: "$25", Stock: 50 }
];

Sheetsee.makeTable({
  data: data,
  tableDiv: "#productTable",
  templateID: "customTemplate",
  pagination: 20
});
```

## Support

- **Issues:** [GitHub Issues](https://github.com/jlord/sheetsee-tables/issues)
- **Documentation:** [README](https://github.com/jlord/sheetsee-tables/blob/main/README.md)

## License

MIT License - See LICENSE file for details.
