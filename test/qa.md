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

- [ ] **Filter** Typing 'cat' should return one page with 3 results
  - [ ] Sorting while filtering shouldn't reset
  - [ ] Filtering shouldn't mess up pagination
- [ ] **No Matches** Typing jibberish returns empty table
- [ ] **One page of pagination** Should change pagaination dom
- [ ] **Clear** Clear button should clear filter and all data returns
- [ ] **Sort** Click the arrows in Rating and table sorts
- [ ] **Pagination** Should be able to navigate between two pages
  - [ ] **Pagination** Should be able to navigate between two pages
