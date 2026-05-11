import * as vscode from 'vscode';

export type CodeTheme = 'auto' | 'dark' | 'light' | 'github-dark' | 'github-light' | 'monokai';
export type ImagePathResolution = 'document' | 'workspace';

export interface MarkeasySettings {
  assetsFolder: string;
  imagePathResolution: ImagePathResolution;
  formatWrap: number;
  calloutsStyle: 'admonition' | 'emoji';
  togglesSyntax: 'details' | 'list';
  mathEnabled: boolean;
  mermaidEnabled: boolean;
  codeTheme: CodeTheme;
  headingColor: string;
  h1Color: string;
  h2Color: string;
  h3Color: string;
  h4Color: string;
  h5Color: string;
  h1Indent: string;
  h2Indent: string;
  h3Indent: string;
  h4Indent: string;
  h5Indent: string;
  boldColor: string;
  italicColor: string;
  fontScale: number;
}

export type ThemeOverrides = Record<string, string>;

// Theme color presets for syntax highlighting
const THEME_PRESETS: Record<string, ThemeOverrides> = {
  dark: {
    '--markeasy-token-comment': '#6a9955',
    '--markeasy-token-punctuation': '#d4d4d4',
    '--markeasy-token-property': '#9cdcfe',
    '--markeasy-token-selector': '#ce9178',
    '--markeasy-token-operator': '#d4d4d4',
    '--markeasy-token-keyword': '#569cd6',
    '--markeasy-token-variable': '#4ec9b0',
    '--markeasy-token-function': '#dcdcaa',
  },
  light: {
    '--markeasy-token-comment': '#008000',
    '--markeasy-token-punctuation': '#000000',
    '--markeasy-token-property': '#001080',
    '--markeasy-token-selector': '#a31515',
    '--markeasy-token-operator': '#000000',
    '--markeasy-token-keyword': '#0000ff',
    '--markeasy-token-variable': '#267f99',
    '--markeasy-token-function': '#795e26',
  },
  'github-dark': {
    '--markeasy-token-comment': '#8b949e',
    '--markeasy-token-punctuation': '#c9d1d9',
    '--markeasy-token-property': '#79c0ff',
    '--markeasy-token-selector': '#a5d6ff',
    '--markeasy-token-operator': '#c9d1d9',
    '--markeasy-token-keyword': '#ff7b72',
    '--markeasy-token-variable': '#7ee787',
    '--markeasy-token-function': '#d2a8ff',
  },
  'github-light': {
    '--markeasy-token-comment': '#6e7781',
    '--markeasy-token-punctuation': '#24292f',
    '--markeasy-token-property': '#0550ae',
    '--markeasy-token-selector': '#0a3069',
    '--markeasy-token-operator': '#24292f',
    '--markeasy-token-keyword': '#cf222e',
    '--markeasy-token-variable': '#116329',
    '--markeasy-token-function': '#8250df',
  },
  monokai: {
    '--markeasy-token-comment': '#88846f',
    '--markeasy-token-punctuation': '#f8f8f2',
    '--markeasy-token-property': '#66d9ef',
    '--markeasy-token-selector': '#e6db74',
    '--markeasy-token-operator': '#f92672',
    '--markeasy-token-keyword': '#f92672',
    '--markeasy-token-variable': '#a6e22e',
    '--markeasy-token-function': '#a6e22e',
  },
};

export function getSettings(): MarkeasySettings {
  const config = vscode.workspace.getConfiguration('markeasy');
  return {
    assetsFolder: config.get<string>('assets.folder', 'assets'),
    imagePathResolution: config.get<ImagePathResolution>('assets.imagePathResolution', 'document'),
    formatWrap: config.get<number>('format.wrap', 0),
    calloutsStyle: config.get<'admonition' | 'emoji'>('callouts.style', 'admonition'),
    togglesSyntax: config.get<'details' | 'list'>('toggles.syntax', 'details'),
    mathEnabled: config.get<boolean>('math.enabled', false),
    mermaidEnabled: config.get<boolean>('mermaid.enabled', false),
    codeTheme: config.get<CodeTheme>('theme.codeTheme', 'auto'),
    headingColor: config.get<string>('theme.headingColor', ''),
    h1Color: config.get<string>('theme.h1Color', ''),
    h2Color: config.get<string>('theme.h2Color', ''),
    h3Color: config.get<string>('theme.h3Color', ''),
    h4Color: config.get<string>('theme.h4Color', ''),
    h5Color: config.get<string>('theme.h5Color', ''),
    h1Indent: config.get<string>('theme.h1Indent', ''),
    h2Indent: config.get<string>('theme.h2Indent', ''),
    h3Indent: config.get<string>('theme.h3Indent', ''),
    h4Indent: config.get<string>('theme.h4Indent', ''),
    h5Indent: config.get<string>('theme.h5Indent', ''),
    boldColor: config.get<string>('theme.boldColor', ''),
    italicColor: config.get<string>('theme.italicColor', ''),
    fontScale: config.get<number>('theme.fontScale', 1),
  };
}

/**
 * Get the effective theme based on settings and VS Code's active color theme
 */
function getEffectiveTheme(codeTheme: CodeTheme): 'dark' | 'light' | 'github-dark' | 'github-light' | 'monokai' {
  if (codeTheme === 'auto') {
    // Detect VS Code theme type
    const colorThemeKind = vscode.window.activeColorTheme.kind;
    // ColorThemeKind: 1 = Light, 2 = Dark, 3 = HighContrast, 4 = HighContrastLight
    if (colorThemeKind === vscode.ColorThemeKind.Light || colorThemeKind === vscode.ColorThemeKind.HighContrastLight) {
      return 'light';
    }
    return 'dark';
  }
  return codeTheme;
}

/**
 * Generate theme CSS variable overrides based on settings
 */
export function getThemeOverrides(settings: MarkeasySettings): ThemeOverrides {
  const effectiveTheme = getEffectiveTheme(settings.codeTheme);
  const overrides: ThemeOverrides = { ...(THEME_PRESETS[effectiveTheme] || THEME_PRESETS.dark) };

  // General heading color (kept for backwards compatibility)
  overrides['--markeasy-heading-color'] = settings.headingColor || 'inherit';

  // Per-level heading colors - specific color takes precedence, then general headingColor, then inherit
  overrides['--markeasy-h1-color'] = settings.h1Color || settings.headingColor || 'inherit';
  overrides['--markeasy-h2-color'] = settings.h2Color || settings.headingColor || 'inherit';
  overrides['--markeasy-h3-color'] = settings.h3Color || settings.headingColor || 'inherit';
  overrides['--markeasy-h4-color'] = settings.h4Color || settings.headingColor || 'inherit';
  overrides['--markeasy-h5-color'] = settings.h5Color || settings.headingColor || 'inherit';

  // Per-level heading indentation - use '0' as default to reset when cleared
  overrides['--markeasy-h1-indent'] = settings.h1Indent || '0';
  overrides['--markeasy-h2-indent'] = settings.h2Indent || '0';
  overrides['--markeasy-h3-indent'] = settings.h3Indent || '0';
  overrides['--markeasy-h4-indent'] = settings.h4Indent || '0';
  overrides['--markeasy-h5-indent'] = settings.h5Indent || '0';

  // Other typography colors
  overrides['--markeasy-bold-color'] = settings.boldColor || 'inherit';
  overrides['--markeasy-italic-color'] = settings.italicColor || 'inherit';

  // Font scale
  overrides['--markeasy-font-scale'] = String(settings.fontScale ?? 1);

  return overrides;
}
