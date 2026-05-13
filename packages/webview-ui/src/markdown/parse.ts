import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfm } from 'micromark-extension-gfm';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import type { Root, Content, PhrasingContent } from 'mdast';

export interface ParseOptions {
  mathEnabled?: boolean;
}

export interface ParseResult {
  root: Root;
}

export function parseMarkdown(text: string, _options: ParseOptions = {}): ParseResult {
  const root = fromMarkdown(preserveEmptyParagraphs(text), {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()],
  });

  return { root };
}

function preserveEmptyParagraphs(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];
  let blankCount = 0;
  let fence: string | null = null;

  const flushBlankLines = () => {
    if (blankCount === 0) {
      return;
    }

    if (fence || blankCount === 1) {
      for (let i = 0; i < blankCount; i++) {
        result.push('');
      }
    } else {
      const emptyParagraphCount = Math.floor(blankCount / 2);
      result.push('');

      for (let i = 0; i < emptyParagraphCount; i++) {
        result.push('<br>');
        result.push('');
      }
    }

    blankCount = 0;
  };

  for (const line of lines) {
    const fenceMatch = line.match(/^ {0,3}(`{3,}|~{3,})/);

    if (!fence && fenceMatch) {
      flushBlankLines();
      fence = fenceMatch[1][0];
      result.push(line);
      continue;
    }

    if (fence && fenceMatch?.[1].startsWith(fence)) {
      flushBlankLines();
      fence = null;
      result.push(line);
      continue;
    }

    if (!fence && /^[ \t]*$/.test(line)) {
      blankCount++;
      continue;
    }

    flushBlankLines();
    result.push(line);
  }

  flushBlankLines();

  return result.join('\n');
}

// Type guards for mdast nodes
export function isParagraph(node: Content): node is Extract<Content, { type: 'paragraph' }> {
  return node.type === 'paragraph';
}

export function isHeading(node: Content): node is Extract<Content, { type: 'heading' }> {
  return node.type === 'heading';
}

export function isList(node: Content): node is Extract<Content, { type: 'list' }> {
  return node.type === 'list';
}

export function isListItem(node: Content): node is Extract<Content, { type: 'listItem' }> {
  return node.type === 'listItem';
}

export function isBlockquote(node: Content): node is Extract<Content, { type: 'blockquote' }> {
  return node.type === 'blockquote';
}

export function isCode(node: Content): node is Extract<Content, { type: 'code' }> {
  return node.type === 'code';
}

export function isThematicBreak(node: Content): node is Extract<Content, { type: 'thematicBreak' }> {
  return node.type === 'thematicBreak';
}

export function isTable(node: Content): node is Extract<Content, { type: 'table' }> {
  return node.type === 'table';
}

export function isImage(node: Content | PhrasingContent): node is Extract<Content, { type: 'image' }> {
  return node.type === 'image';
}

export function isLink(node: Content | PhrasingContent): node is Extract<Content, { type: 'link' }> {
  return node.type === 'link';
}

export function isHtml(node: Content): node is Extract<Content, { type: 'html' }> {
  return node.type === 'html';
}

export function isText(node: Content | PhrasingContent): node is Extract<PhrasingContent, { type: 'text' }> {
  return node.type === 'text';
}

export function isStrong(node: Content | PhrasingContent): node is Extract<PhrasingContent, { type: 'strong' }> {
  return node.type === 'strong';
}

export function isEmphasis(node: Content | PhrasingContent): node is Extract<PhrasingContent, { type: 'emphasis' }> {
  return node.type === 'emphasis';
}

export function isInlineCode(node: Content | PhrasingContent): node is Extract<PhrasingContent, { type: 'inlineCode' }> {
  return node.type === 'inlineCode';
}

export function isDelete(node: Content | PhrasingContent): node is Extract<PhrasingContent, { type: 'delete' }> {
  return node.type === 'delete';
}
