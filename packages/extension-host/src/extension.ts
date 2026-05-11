import * as vscode from 'vscode';
import { MarkeasyEditorProvider } from './customEditor';
import { registerCommands } from './commands';

export function activate(context: vscode.ExtensionContext): void {
  // Register the custom editor provider
  context.subscriptions.push(MarkeasyEditorProvider.register(context));

  // Register commands
  registerCommands(context);

  console.log('Markeasy extension activated');
}

export function deactivate(): void {
  console.log('Markeasy extension deactivated');
}
