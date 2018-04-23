'use strict';
import { ExtensionContext, commands, window } from 'vscode';
import { SymbolsTreeDataProvider } from './symbolsTreeDataProvider';

export function activate(context: ExtensionContext) {
    console.log('Extension activated!!');
    const symbolsTreeDataProvider = new SymbolsTreeDataProvider(context);
    context.subscriptions.push(window.registerTreeDataProvider('symbolExplorer', symbolsTreeDataProvider));

    const navigateSymbolCommand = commands.registerCommand('symbolExplorer.navigateSymbol', range => { symbolsTreeDataProvider.select(range); });
    context.subscriptions.push(navigateSymbolCommand);

    const refreshSymbolCommand = commands.registerCommand('symbolExplorer.refresh', () => symbolsTreeDataProvider.refresh());
    context.subscriptions.push(refreshSymbolCommand);
}

// this method is called when your extension is deactivated
export function deactivate() { }
