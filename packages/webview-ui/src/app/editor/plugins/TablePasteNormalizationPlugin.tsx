import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { COMMAND_PRIORITY_HIGH, PASTE_COMMAND } from 'lexical';

import { exportLexicalToMdast } from '../../mapper/lexicalToMdast';
import { importMarkdownToLexical } from '../../mapper/mdastToLexical';
import { parseMarkdown } from '../../../markdown/parse';
import { stringifyMarkdown } from '../../../markdown/stringify';

function hasMarkdownTable(text: string): boolean {
  const lines = text.split(/\r?\n/);

  return lines.some((line, index) => {
    const nextLine = lines[index + 1];
    if (!nextLine || !line.includes('|')) return false;

    return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(nextLine);
  });
}

function hasTabularText(text: string): boolean {
  const rows = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return rows.length > 1 && rows.some((row) => row.includes('\t'));
}

function hasTableClipboardData(event: ClipboardEvent): boolean {
  const html = event.clipboardData?.getData('text/html') ?? '';
  const text = event.clipboardData?.getData('text/plain') ?? '';

  return html.toLowerCase().includes('<table') || hasMarkdownTable(text) || hasTabularText(text);
}

export function TablePasteNormalizationPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    let normalizeTimer: number | null = null;

    const unregister = editor.registerCommand(
      PASTE_COMMAND,
      (event: ClipboardEvent) => {
        if (!hasTableClipboardData(event)) return false;

        if (normalizeTimer !== null) {
          clearTimeout(normalizeTimer);
        }

        normalizeTimer = window.setTimeout(() => {
          normalizeTimer = null;

          const markdown = stringifyMarkdown(exportLexicalToMdast(editor));
          const { root } = parseMarkdown(markdown);
          importMarkdownToLexical(editor, root);
        }, 0);

        return false;
      },
      COMMAND_PRIORITY_HIGH,
    );

    return () => {
      if (normalizeTimer !== null) {
        clearTimeout(normalizeTimer);
      }
      unregister();
    };
  }, [editor]);

  return null;
}
