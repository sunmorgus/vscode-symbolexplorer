'use strict';
import { ExtensionContext, commands, window, workspace } from 'vscode';
import { SymbolsTreeDataProvider } from './symbolsTreeDataProvider';
import { View, Sort } from './globals/enums';

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
    const symbolsTreeDataProvider = new SymbolsTreeDataProvider(context, View.Debug);
    context.subscriptions.push(window.registerTreeDataProvider('symbolExplorerDebug', symbolsTreeDataProvider));

    // Setup Navigate Command
    const navigateSymbolCommand = commands.registerCommand('symbolExplorerDebug.navigateSymbol', range => { symbolsTreeDataProvider.select(range); });
    context.subscriptions.push(navigateSymbolCommand);

    // Setup Refresh Button
    const refreshSymbolCommand = commands.registerCommand('symbolExplorerDebug.refresh', () => symbolsTreeDataProvider.refresh());
    context.subscriptions.push(refreshSymbolCommand);

    // Setup Sort Asc Button
    const sortAscSymbolCommand = commands.registerCommand('symbolExplorerDebug.sortAsc', () => symbolsTreeDataProvider.refresh(Sort.Asc));
    context.subscriptions.push(sortAscSymbolCommand);

    // Setup Sort Desc Button
    const sortDescSymbolCommand = commands.registerCommand('symbolExplorerDebug.sortDesc', () => symbolsTreeDataProvider.refresh(Sort.Desc));
    context.subscriptions.push(sortDescSymbolCommand);
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

    // Setup Sort Asc Button
    const sortAscSymbolCommand = commands.registerCommand('symbolExplorer.sortAsc', () => symbolsTreeDataProvider.refresh(Sort.Asc));
    context.subscriptions.push(sortAscSymbolCommand);

    // Setup Sort Desc Button
    const sortDescSymbolCommand = commands.registerCommand('symbolExplorer.sortDesc', () => symbolsTreeDataProvider.refresh(Sort.Desc));
    context.subscriptions.push(sortDescSymbolCommand);
}

function setupActivityBarView(context: ExtensionContext) {
    // Setup Tree Data Provider
    const symbolsTreeDataProvider = new SymbolsTreeDataProvider(context, View.View);
    context.subscriptions.push(window.registerTreeDataProvider('symbolExplorerView', symbolsTreeDataProvider));

    // Setup Navigate Command
    const navigateSymbolCommand = commands.registerCommand('symbolExplorerView.navigateSymbol', range => { symbolsTreeDataProvider.select(range); });
    context.subscriptions.push(navigateSymbolCommand);

    // Setup Refresh Button
    const refreshSymbolCommand = commands.registerCommand('symbolExplorerView.refresh', () => symbolsTreeDataProvider.refresh());
    context.subscriptions.push(refreshSymbolCommand);

    // Setup Sort Asc Button
    const sortAscSymbolCommand = commands.registerCommand('symbolExplorerView.sortAsc', () => symbolsTreeDataProvider.refresh(Sort.Asc));
    context.subscriptions.push(sortAscSymbolCommand);

    // Setup Sort Desc Button
    const sortDescSymbolCommand = commands.registerCommand('symbolExplorerView.sortDesc', () => symbolsTreeDataProvider.refresh(Sort.Desc));
    context.subscriptions.push(sortDescSymbolCommand);
}

// this method is called when your extension is deactivated
export function deactivate() { }
