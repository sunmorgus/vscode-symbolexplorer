'use strict';
import { ExtensionContext, commands, window, workspace } from 'vscode';
import { SymbolsTreeDataProvider } from './symbolsTreeDataProvider';
import { View } from './globals/enums';

export function activate(context: ExtensionContext) {
    const extensionPrefix: string = 'vscode-symbolexplorer';
    const enum configurationSettings {
        showExplorer = 'showExplorer',
        showExplorerDebug = 'showExplorerDebug'
    }

    const showExplorer: boolean = workspace.getConfiguration(extensionPrefix).get(configurationSettings.showExplorer);
    const showExplorerDebug: boolean = workspace.getConfiguration(extensionPrefix).get(configurationSettings.showExplorerDebug);

    setupActivityBarView(context);

    if (showExplorer) {
        setupExplorerView(context);
    }

    if (showExplorerDebug) {
        setupDebugView(context);
    }
}

function setupDebugView(context: ExtensionContext) {
    // Setup Tree Data Provider
    const symbolsTreeDataProviderDebug = new SymbolsTreeDataProvider(context, View.Debug);
    context.subscriptions.push(window.registerTreeDataProvider('symbolExplorerDebug', symbolsTreeDataProviderDebug));

    // Setup Navigate Command
    const navigateSymbolCommandDebug = commands.registerCommand('symbolExplorerDebug.navigateSymbol', range => { symbolsTreeDataProviderDebug.select(range); });
    context.subscriptions.push(navigateSymbolCommandDebug);

    // Setup Refresh Button
    const refreshSymbolCommandDebug = commands.registerCommand('symbolExplorerDebug.refresh', () => symbolsTreeDataProviderDebug.refresh());
    context.subscriptions.push(refreshSymbolCommandDebug);
}

function setupExplorerView(context: ExtensionContext) {
    // Setup Tree Data Provider
    const symbolsTreeDataProvider = new SymbolsTreeDataProvider(context, View.Explorer);
    context.subscriptions.push(window.registerTreeDataProvider('symbolExplorer', symbolsTreeDataProvider));

    // Setup Navigate Command
    const navigateSymbolCommand = commands.registerCommand('symbolExplorer.navigateSymbol', range => { symbolsTreeDataProvider.select(range); });
    context.subscriptions.push(navigateSymbolCommand);

    // Setup Refresh Button
    const refreshSymbolCommand = commands.registerCommand('symbolExplorer.refresh', () => symbolsTreeDataProvider.refresh());
    context.subscriptions.push(refreshSymbolCommand);
}

function setupActivityBarView(context: ExtensionContext) {
    // Setup Tree Data Provider
    const symbolsTreeDataProviderView = new SymbolsTreeDataProvider(context, View.View);
    context.subscriptions.push(window.registerTreeDataProvider('symbolExplorerView', symbolsTreeDataProviderView));

    // Setup Navigate Command
    const navigateSymbolCommandView = commands.registerCommand('symbolExplorerView.navigateSymbol', range => { symbolsTreeDataProviderView.select(range); });
    context.subscriptions.push(navigateSymbolCommandView);

    // Setup Refresh Button
    const refreshSymbolCommandView = commands.registerCommand('symbolExplorerView.refresh', () => symbolsTreeDataProviderView.refresh());
    context.subscriptions.push(refreshSymbolCommandView);
}

// this method is called when your extension is deactivated
export function deactivate() { }
