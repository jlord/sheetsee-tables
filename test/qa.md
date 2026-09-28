# Testing

When making edits to `index.js` you can browserify the page and test it with a table demo here.

_Todo have browserify watch for changes to `index.js`_

```bash
# To browserify and launch test html in browser
npm test
# To just re-browserify and refresh in browser manually
npm run bfy
```

# QA

- [ ] **Filter** Typing 'cat' should return 3 results over 2 pages (2 rows, then 1 row)
  - [ ] Sorting while filtering should keep only matching rows
  - [ ] Filtering shouldn't mess up pagination
- [ ] **No Matches** Typing jibberish returns empty table
- [ ] **One page of pagination** Should change pagaination dom
- [ ] **Clear** Clear button should clear filter and all data returns
- [ ] **Sort** Click the arrows in Rating and table sorts
- [ ] **Pagination** The initial 5 rows should span 3 pages (2 rows, 2 rows, 1 row)
  - [ ] **Pagination** Previous/Next should stop at the first/last page

# CSV walkthrough

Build with `npm run build:example` and serve the repository over HTTP as described in the README. Open `/example/`.

- [ ] The sample reports 5 loaded rows; page 1 contains Liza and Boo.
- [ ] Next shows Sam and Snowy; Next again shows Trisana. Previous returns to Sam and Snowy.
- [ ] After reloading, filter `Dog` shows Boo and Sam on one page. Clear restores all rows.
- [ ] Filter `zzzz` displays “No results”; Clear restores the table.
- [ ] After reloading, click Name: Boo and Liza appear first. Click Name again: Trisana and Snowy appear first.
- [ ] Enter `missing.csv` in CSV address and submit. An HTTP 404 error appears; filtering remains disabled.
- [ ] Reload `/example/` to return to the sample. Replace `example/data.csv` with a CSV export using the same headers and reload to see its rows.
