'use strict';
import { ExtensionContext, commands, window } from 'vscode';
import { SymbolsTreeDataProvider } from './symbolsTreeDataProvider';

export function activate(context: ExtensionContext) {
    console.log('Extension activated!!');
    const symbolsTreeDataProvider = new SymbolsTreeDataProvider(context, false);
    context.subscriptions.push(window.registerTreeDataProvider('symbolExplorer', symbolsTreeDataProvider));

    const navigateSymbolCommand = commands.registerCommand('symbolExplorer.navigateSymbol', range => { symbolsTreeDataProvider.select(range); });
    context.subscriptions.push(navigateSymbolCommand);

    const refreshSymbolCommand = commands.registerCommand('symbolExplorer.refresh', () => symbolsTreeDataProvider.refresh());
    context.subscriptions.push(refreshSymbolCommand);

    const symbolsTreeDataProviderDebug = new SymbolsTreeDataProvider(context, true);
    context.subscriptions.push(window.registerTreeDataProvider('symbolExplorerDebug', symbolsTreeDataProviderDebug));

    const navigateSymbolCommandDebug = commands.registerCommand('symbolExplorerDebug.navigateSymbol', range => { symbolsTreeDataProviderDebug.select(range); });
    context.subscriptions.push(navigateSymbolCommandDebug);

    const refreshSymbolCommandDebug = commands.registerCommand('symbolExplorerDebug.refresh', () => symbolsTreeDataProviderDebug.refresh());
    context.subscriptions.push(refreshSymbolCommandDebug);
}

// this method is called when your extension is deactivated
export function deactivate() { }
