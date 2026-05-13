import { type CSSProperties, useCallback, useEffect, useRef, useMemo } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { CodeNode, CodeHighlightNode, registerCodeHighlighting } from '@lexical/code';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { TableNode, TableRowNode, TableCellNode } from '@lexical/table';
import { EditorState, LexicalEditor } from 'lexical';

import { Toolbar } from './components/Toolbar';
import { SlashMenuPlugin } from './plugins/SlashMenuPlugin';
import { DragHandlePlugin } from './plugins/DragHandlePlugin';
import { MarkdownShortcutsPlugin } from './plugins/MarkdownShortcutsPlugin';
import { TableActionsPlugin } from './plugins/TableActionsPlugin';
import { TablePasteNormalizationPlugin } from './plugins/TablePasteNormalizationPlugin';
import { CodeBlockPlugin } from './plugins/CodeBlockPlugin';
import { CodeFencePlugin } from './plugins/CodeFencePlugin';
import { TogglePlugin } from './plugins/TogglePlugin';
import { ImagePlugin } from './plugins/ImagePlugin';
import { BlockClickPlugin } from './plugins/BlockClickPlugin';
import { SearchPlugin } from './plugins/SearchPlugin';
import { PasteLinkPlugin } from './plugins/PasteLinkPlugin';
import { AutoLinkPlugin } from './plugins/AutoLinkPlugin';
import { BacktickWrapPlugin } from './plugins/BacktickWrapPlugin';
import { AssetContext, createAssetContextValue } from './context/AssetContext';
import {
  CalloutNode,
  ToggleContainerNode,
  ToggleTitleNode,
  ToggleContentNode,
  ImageNode,
  HorizontalRuleNode,
} from './nodes';
import { importMarkdownToLexical } from '../mapper/mdastToLexical';
import { exportLexicalToMdast } from '../mapper/lexicalToMdast';
import { parseMarkdown } from '../../markdown/parse';
import { stringifyMarkdown } from '../../markdown/stringify';
import type { ImagePathResolution } from '../../types';

interface EditorProps {
  initialContent: string;
  onChange: (markdown: string) => void;
  assetBaseUri?: string;
  documentDirUri?: string;
  imagePathResolution?: ImagePathResolution;
  pageWidth?: number;
  sidePadding?: number;
}

const editorTheme = {
  paragraph: 'editor-paragraph',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
    h4: 'editor-heading-h4',
    h5: 'editor-heading-h5',
  },
  list: {
    ul: 'editor-list-ul',
    ol: 'editor-list-ol',
    listitem: 'editor-listitem',
    listitemChecked: 'editor-listitem-checked',
    listitemUnchecked: 'editor-listitem-unchecked',
    nested: {
      listitem: 'editor-nested-listitem',
    },
  },
  quote: 'editor-quote',
  code: 'editor-code',
  codeHighlight: {
    atrule: 'editor-tokenAttr',
    attr: 'editor-tokenAttr',
    boolean: 'editor-tokenProperty',
    builtin: 'editor-tokenSelector',
    cdata: 'editor-tokenComment',
    char: 'editor-tokenSelector',
    class: 'editor-tokenFunction',
    'class-name': 'editor-tokenFunction',
    comment: 'editor-tokenComment',
    constant: 'editor-tokenProperty',
    deleted: 'editor-tokenProperty',
    doctype: 'editor-tokenComment',
    entity: 'editor-tokenOperator',
    function: 'editor-tokenFunction',
    important: 'editor-tokenVariable',
    inserted: 'editor-tokenSelector',
    keyword: 'editor-tokenAttr',
    namespace: 'editor-tokenVariable',
    number: 'editor-tokenProperty',
    operator: 'editor-tokenOperator',
    prolog: 'editor-tokenComment',
    property: 'editor-tokenProperty',
    punctuation: 'editor-tokenPunctuation',
    regex: 'editor-tokenVariable',
    selector: 'editor-tokenSelector',
    string: 'editor-tokenSelector',
    symbol: 'editor-tokenProperty',
    tag: 'editor-tokenProperty',
    url: 'editor-tokenOperator',
    variable: 'editor-tokenVariable',
  },
  link: 'editor-link',
  table: 'editor-table',
  tableRow: 'editor-table-row',
  tableCell: 'editor-table-cell',
  tableCellHeader: 'editor-table-cell-header',
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    strikethrough: 'editor-text-strikethrough',
    code: 'editor-text-code',
    underline: 'editor-text-underline',
  },
};

function editorOnError(error: Error): void {
  console.error('Lexical error:', error);
}

const editorNodes = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  CodeNode,
  CodeHighlightNode,
  LinkNode,
  AutoLinkNode,
  TableNode,
  TableRowNode,
  TableCellNode,
  CalloutNode,
  ToggleContainerNode,
  ToggleTitleNode,
  ToggleContentNode,
  ImageNode,
  HorizontalRuleNode,
];

function CodeHighlightPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return registerCodeHighlighting(editor);
  }, [editor]);

  return null;
}

function InitializePlugin({ content }: { content: string }) {
  const [editor] = useLexicalComposerContext();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (content) {
      const { root } = parseMarkdown(content);
      importMarkdownToLexical(editor, root);
    }
  }, [editor, content]);

  return null;
}

function AutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();
  const hasFocused = useRef(false);

  useEffect(() => {
    if (hasFocused.current) return;
    hasFocused.current = true;

    // Small delay to ensure the editor is fully ready
    const timeoutId = setTimeout(() => {
      const rootElement = editor.getRootElement();
      if (rootElement) {
        // Focus without scrolling
        rootElement.focus({ preventScroll: true });
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [editor]);

  return null;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

function ExternalUpdatePlugin({
  content,
  currentContent,
}: {
  content: string;
  currentContent: React.MutableRefObject<string>;
}) {
  const [editor] = useLexicalComposerContext();
  const lastContentHashRef = useRef<number>(0);

  useEffect(() => {
    const contentHash = simpleHash(content);

    if (content === currentContent.current) {
      lastContentHashRef.current = contentHash;
      return;
    }

    // Skip if content hash matches (content identical)
    if (contentHash === lastContentHashRef.current) {
      return;
    }
    lastContentHashRef.current = contentHash;
    currentContent.current = content;

    const { root } = parseMarkdown(content);
    importMarkdownToLexical(editor, root);
  }, [editor, content, currentContent]);

  return null;
}

const DEBOUNCE_DELAY = 100;
const DEFAULT_PAGE_WIDTH = 800;
const DEFAULT_SIDE_PADDING = 32;

export function Editor({
  initialContent,
  onChange,
  assetBaseUri,
  documentDirUri,
  imagePathResolution,
  pageWidth = DEFAULT_PAGE_WIDTH,
  sidePadding = DEFAULT_SIDE_PADDING,
}: EditorProps) {
  const currentContentRef = useRef<string>(initialContent);
  const debounceTimerRef = useRef<number | null>(null);
  const pendingEditorRef = useRef<LexicalEditor | null>(null);

  const assetContextValue = useMemo(
    () => createAssetContextValue({ assetBaseUri, documentDirUri, imagePathResolution }),
    [assetBaseUri, documentDirUri, imagePathResolution]
  );

  const editorContainerStyle = useMemo(
    () => ({
      '--markeasy-page-width': `${pageWidth}px`,
      '--markeasy-side-padding': `${sidePadding}px`,
    }) as CSSProperties,
    [pageWidth, sidePadding]
  );

  const flushPendingChange = useCallback(() => {
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    const pendingEditor = pendingEditorRef.current;
    if (!pendingEditor) return;

    const mdast = exportLexicalToMdast(pendingEditor);
    const markdown = stringifyMarkdown(mdast);

    if (markdown !== currentContentRef.current) {
      currentContentRef.current = markdown;
      onChange(markdown);
    }
  }, [onChange]);

  useEffect(() => {
    window.addEventListener('pagehide', flushPendingChange);
    window.addEventListener('beforeunload', flushPendingChange);

    return () => {
      window.removeEventListener('pagehide', flushPendingChange);
      window.removeEventListener('beforeunload', flushPendingChange);
      flushPendingChange();
    };
  }, [flushPendingChange]);

  const handleChange = useCallback(
    (_editorState: EditorState, editor: LexicalEditor, tags: Set<string>) => {
      // Store the latest editor for debounced processing
      pendingEditorRef.current = editor;

      // Clear existing timer
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }

      // Debounce the expensive mdast conversion
      debounceTimerRef.current = window.setTimeout(() => {
        flushPendingChange();
      }, DEBOUNCE_DELAY);

      if (tags.has('historic')) {
        flushPendingChange();
      }
    },
    [flushPendingChange]
  );

  const initialConfig = {
    namespace: 'Markeasy',
    theme: editorTheme,
    nodes: editorNodes,
    onError: editorOnError,
  };

  return (
    <AssetContext.Provider value={assetContextValue}>
      <LexicalComposer initialConfig={initialConfig}>
        <div className="editor-container" style={editorContainerStyle}>
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="editor-input" aria-label="Markdown editor" />
              }
              placeholder={
                <div className="editor-placeholder">
                  Type '/' for commands...
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <ListPlugin />
            <CheckListPlugin />
            <TabIndentationPlugin />
            <LinkPlugin />
            <AutoLinkPlugin />
            <TablePlugin />
            <TablePasteNormalizationPlugin />
            <CodeHighlightPlugin />
            <OnChangePlugin onChange={handleChange} ignoreSelectionChange />
            <InitializePlugin content={initialContent} />
            <AutoFocusPlugin />
            <ExternalUpdatePlugin
              content={initialContent}
              currentContent={currentContentRef}
            />
            <SlashMenuPlugin />
            <DragHandlePlugin />
            <MarkdownShortcutsPlugin />
            <TableActionsPlugin />
            <CodeBlockPlugin />
            <CodeFencePlugin />
            <TogglePlugin />
            <ImagePlugin />
            <PasteLinkPlugin />
            <BacktickWrapPlugin />
            <BlockClickPlugin />
            <Toolbar />
            <SearchPlugin />
          </div>
        </div>
      </LexicalComposer>
    </AssetContext.Provider>
  );
}
