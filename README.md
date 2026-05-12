# Markeasy

A Notion-style block editor for Markdown files. Write beautifully, store as plain Markdown.

There is an interactive demo with a rough copy of the editor on [Markeasy](https://markeasy.dev)

![Markeasy Demo](https://github.com/wolfdavo/Markeasy/blob/main/markeasy-example.gif?raw=true)

## Why Markeasy?

Markdown is powerful but editing raw syntax can be tedious. Markeasy gives you the best of both worlds:

- **Write visually** — No more counting `#` symbols or matching brackets
- **Store as Markdown** — Your files stay portable, version-control friendly, and readable anywhere
- **Works instantly** — Opens `.md` files automatically with zero configuration

## Features

<https://burberry.atlassian.net/browse/EWS-1316>

tps\://burberry.atlassian.net/browse/EWS-1316

<https://burberry.atlassian.net/browse/EWS-1316>

### Slash Commands

Type `/` anywhere to insert blocks with fuzzy search. Headings, lists, code blocks, tables, callouts — all just a keystroke away.

You can also type ` ```lang ` on an empty line and press Enter to create a code block with the language already set (e.g. ` ```typescript `).

### Block-Based Editing

- **Drag & drop** blocks to reorder content
- **Indent/outdent** with Tab and Shift+Tab
- **Move blocks** with Alt+Arrow keys

### Rich Content

| Block Type      | Markdown Output         |
| --------------- | ----------------------- |
| Headings        | `# ## ###`              |
| Bullet lists    | `- item`                |
| Numbered lists  | `1. item`               |
| Todo checkboxes | `- [ ] task`            |
| Blockquotes     | `> quote`               |
| Code blocks     | ` ```lang ``` `         |
| Tables          | GFM tables              |
| Callouts        | `> [!NOTE]` admonitions |
| Toggles         | `<details>` HTML        |
| Images          | `![alt](path)`          |
| Dividers        | `---`                   |

### Inline Formatting

Select text to reveal the formatting toolbar:

- **Bold** (Cmd/Ctrl+B)
- *Italic* (Cmd/Ctrl+I)
- `Code` (Cmd/Ctrl+E)
- [Links](.) (Cmd/Ctrl+K)
- ~~Strikethrough~~

**Shortcuts for selected text:**

- Press `` ` `` with text selected to toggle inline code
- Paste a URL over selected text to turn it into a link
- Surround text with `` `backticks` `` while typing to apply inline code

### Image Support

Paste or drag images directly into the editor. Markeasy automatically saves them to your assets folder and inserts the Markdown reference.

### Theme Integration

Markeasy respects your VS Code color theme — light, dark, or high contrast.

#### Code Block Themes

By default, code block syntax highlighting automatically adapts to your VS Code theme (light or dark). You can also choose a specific theme:

| Theme          | Description                |
| -------------- | -------------------------- |
| `auto`         | Matches your VS Code theme |
| `dark`         | VS Code Dark+ colors       |
| `light`        | VS Code Light+ colors      |
| `github-dark`  | GitHub's dark theme        |
| `github-light` | GitHub's light theme       |
| `monokai`      | Classic Monokai colors     |

Change this in Settings → `markeasy.theme.codeTheme`

#### Typography Colors

Customize colors for headings, bold, and italic text:

- `markeasy.theme.headingColor` — Color for all headings (fallback)
- `markeasy.theme.h1Color` / `h2Color` / `h3Color` / `h4Color` / `h5Color` — Per-level heading colors (override headingColor)
- `markeasy.theme.boldColor` — Color for bold text
- `markeasy.theme.italicColor` — Color for italic text

#### Heading Indentation

Add left indentation to create a visual hierarchy:

- `markeasy.theme.h1Indent` / `h2Indent` / `h3Indent` / `h4Indent` / `h5Indent` — e.g., `0`, `16px`, `2em`

Leave any setting empty to use the default.

## Keyboard Shortcuts

| Shortcut      | Action                              |
| ------------- | ----------------------------------- |
| `/`           | Open slash menu                     |
| `Cmd/Ctrl+B`  | Bold                                |
| `Cmd/Ctrl+I`  | Italic                              |
| `Cmd/Ctrl+E`  | Inline code                         |
| `Cmd/Ctrl+K`  | Insert link                         |
| `` ` ``       | Toggle inline code on selected text |
| `Tab`         | Indent list item                    |
| `Shift+Tab`   | Outdent list item                   |
| `Alt+Up/Down` | Move block up/down                  |

## Commands

- **Markeasy: Open as Raw Markdown** — Switch to the plain text editor
- **Markeasy: Open as Markeasy** — Open a Markdown file in Markeasy
- **Markeasy: Copy Markdown Content** — Copy the document to clipboard

## Settings

| Setting                       | Description                              | Default      |
| ----------------------------- | ---------------------------------------- | ------------ |
| `markeasy.assets.folder`      | Folder for pasted images                 | `assets`     |
| `markeasy.callouts.style`     | Callout syntax (`admonition` or `emoji`) | `admonition` |
| `markeasy.toggles.syntax`     | Toggle syntax (`details` or `list`)      | `details`    |
| `markeasy.theme.codeTheme`    | Code block syntax highlighting theme     | `auto`       |
| `markeasy.theme.headingColor` | Color for all headings (fallback)        | *(none)*     |
| `markeasy.theme.h1Color`      | Color for H1 headings                    | *(none)*     |
| `markeasy.theme.h2Color`      | Color for H2 headings                    | *(none)*     |
| `markeasy.theme.h3Color`      | Color for H3 headings                    | *(none)*     |
| `markeasy.theme.h4Color`      | Color for H4 headings                    | *(none)*     |
| `markeasy.theme.h5Color`      | Color for H5 headings                    | *(none)*     |
| `markeasy.theme.h1Indent`     | Left indent for H1 headings              | *(none)*     |
| `markeasy.theme.h2Indent`     | Left indent for H2 headings              | *(none)*     |
| `markeasy.theme.h3Indent`     | Left indent for H3 headings              | *(none)*     |
| `markeasy.theme.h4Indent`     | Left indent for H4 headings              | *(none)*     |
| `markeasy.theme.h5Indent`     | Left indent for H5 headings              | *(none)*     |
| `markeasy.theme.boldColor`    | Color for bold text                      | *(none)*     |
| `markeasy.theme.italicColor`  | Color for italic text                    | *(none)*     |

## Requirements

- VS Code 1.85.0+ or Cursor

## Links

- [Website](https://markeasy.dev)
- [GitHub Repository](https://github.com/wolfdavo/Markeasy)
- [Report Issues](https://github.com/wolfdavo/Markeasy/issues)

## License

MIT
