# ddu-source-inkdrop

Ddu sources for Inkdrop Local HTTP Server.

## Requirements

- denops.vim
- ddu.vim
- ddu-kind-file
- denops-inkdrop.vim (for storing credentials via :InkdropLogin)

## Sources

- `inkdrop_notes`
- `inkdrop_books`
- `inkdrop_tags`
- `inkdrop_status`

## Setup

```vim
call ddu#start({
  \ 'sources': [
  \   { 'name': 'inkdrop_notes' },
  \ ],
  \ 'kindOptions': { 'file': { 'defaultAction': 'edit' } },
  \ })
```

### Parameters

`inkdrop_notes`:

- `keyword` (string): search keyword
- `limit` (number): max notes per request (default: 100)
- `skip` (number): offset for paging (default: 0)
- `sort` ("updatedAt" | "createdAt" | "title"): sort key
- `descending` (boolean): sort order (default: true)
- `bookId` (string): filter by notebook id
- `tagId` (string): filter by tag id
- `statuses` (string[]): filter by status (e.g. `{"active", "onHold"}`)
- `pinned` (boolean): filter pinned notes

`inkdrop_books` / `inkdrop_tags` take no parameters.
`inkdrop_status` takes no parameters.

`inkdrop_status` uses the `inkdrop_menu` kind and opens `inkdrop_notes` with
`push = true`.

## License

MIT
