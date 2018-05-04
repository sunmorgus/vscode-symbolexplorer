'use strict';
import { ExtensionContext, commands, window, workspace } from 'vscode';
import { SymbolsTreeDataProvider, View } from './symbolsTreeDataProvider';

export function activate(context: ExtensionContext) {
    const extensionPrefix: string = 'vscode-symbolexplorer';
    const enum configurationSettings {
        showExplorer = 'showExplorer',
        showExplorerDebug = 'showExplorerDebug'
    }

    const showExplorer: boolean = workspace.getConfiguration(extensionPrefix).get(configurationSettings.showExplorer);
    const showExplorerDebug: boolean = workspace.getConfiguration(extensionPrefix).get(configurationSettings.showExplorerDebug);

    const symbolsTreeDataProviderView = new SymbolsTreeDataProvider(context, View.View);
    context.subscriptions.push(window.registerTreeDataProvider('symbolExplorerView', symbolsTreeDataProviderView));

    const navigateSymbolCommandView = commands.registerCommand('symbolExplorerView.navigateSymbol', range => { symbolsTreeDataProviderView.select(range); });
    context.subscriptions.push(navigateSymbolCommandView);

    const refreshSymbolCommandView = commands.registerCommand('symbolExplorerView.refresh', () => symbolsTreeDataProviderView.refresh());
    context.subscriptions.push(refreshSymbolCommandView);

    if (showExplorer) {
        const symbolsTreeDataProvider = new SymbolsTreeDataProvider(context, View.Explorer);
        context.subscriptions.push(window.registerTreeDataProvider('symbolExplorer', symbolsTreeDataProvider));

        const navigateSymbolCommand = commands.registerCommand('symbolExplorer.navigateSymbol', range => { symbolsTreeDataProvider.select(range); });
        context.subscriptions.push(navigateSymbolCommand);

        const refreshSymbolCommand = commands.registerCommand('symbolExplorer.refresh', () => symbolsTreeDataProvider.refresh());
        context.subscriptions.push(refreshSymbolCommand);
    }

    if (showExplorerDebug) {
        const symbolsTreeDataProviderDebug = new SymbolsTreeDataProvider(context, View.Debug);
        context.subscriptions.push(window.registerTreeDataProvider('symbolExplorerDebug', symbolsTreeDataProviderDebug));

        const navigateSymbolCommandDebug = commands.registerCommand('symbolExplorerDebug.navigateSymbol', range => { symbolsTreeDataProviderDebug.select(range); });
        context.subscriptions.push(navigateSymbolCommandDebug);

        const refreshSymbolCommandDebug = commands.registerCommand('symbolExplorerDebug.refresh', () => symbolsTreeDataProviderDebug.refresh());
        context.subscriptions.push(refreshSymbolCommandDebug);
    }
}

// this method is called when your extension is deactivated
export function deactivate() { }
