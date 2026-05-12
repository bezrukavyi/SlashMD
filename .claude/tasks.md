Tasks todo

- [ ] **Text promoted from a heading retains heading styling** When text is moved out of a heading block into body content, it keeps the heading's visual style. Expected: it becomes a plain paragraph.
- [ ] When typing or pasting text that begins with `{num.}` (e.g. `1.`, `2.`), automatically convert the line into an ordered list item. At the same time when a user click escape button in right end of range of "{num}." symbol I don't want to remove the number - I want to convert it into a simple string line with keeping the number so. and then allow user removes the {num.} element.
- [ ] It doesn't: **Pressing Escape on the first checkbox item converts all remaining items to a plain list** Expected: only the first item is demoted to a paragraph, rest remain as checkboxes.

### Done

- [x] **Atlassian-style URLs are not auto-linked** URLs like `https://burberry.atlassian.net/browse/EWS-1316` are not converted into clickable links. Expected: any valid URL typed or pasted inline becomes a hyperlink.
- [x] **Pressing Escape on the first checkbox item converts all remaining items to a plain list** Expected: only the first item is demoted to a paragraph, rest remain as checkboxes. \[x] When the cursor is at the beginning of a numbered list item and the user presses Escape, demote it to a plain paragraph — the same behavior as Cmd+Z immediately after the auto-conversion.
- [x] **Wrap paragraphs into checkbox list via toolbar popup** Added ☑ button to the selection toolbar.
- [x] **Nested unchecked checkboxes revert to a plain nested list:** After closing and reopening the file, nested `[ ]` items are rendered as regular bullet list items. Expected: they persist as unchecked checkboxes. The new issue: When the are no title between checkeboxes the shole structure is braking. For example. It was a checkbox structure.
