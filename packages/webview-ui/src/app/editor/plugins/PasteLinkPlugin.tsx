import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { PASTE_COMMAND, COMMAND_PRIORITY_HIGH, $getSelection, $isRangeSelection, $createTextNode } from 'lexical';
import { toggleLink, $createLinkNode } from '@lexical/link';

function isUrl(text: string): boolean {
  try {
    const url = new URL(text.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function PasteLinkPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      PASTE_COMMAND,
      (event: ClipboardEvent) => {
        const text = event.clipboardData?.getData('text/plain').trim() ?? '';
        if (!isUrl(text)) return false;

        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return false;

        if (selection.isCollapsed()) {
          // No selected text — insert the URL as a clickable link node
          const linkNode = $createLinkNode(text);
          linkNode.append($createTextNode(text));
          selection.insertNodes([linkNode]);
        } else {
          // Wrap selected text as a link
          toggleLink(text);
        }
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );
  }, [editor]);

  return null;
}
