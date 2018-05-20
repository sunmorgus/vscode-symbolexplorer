'use strict';
import { ExtensionContext, commands, window, workspace, WorkspaceConfiguration } from 'vscode';
import { SymbolsTreeDataProvider } from './symbolsTreeDataProvider';
import { View, Sort, configurationSettings } from './globals/enums';
import TelemetryReporter from 'vscode-extension-telemetry';

const extensionPrefix: string = 'vscode-symbolexplorer';
const extensionVersion: string = '0.0.9';
const key: string = '43646677-3947-4bf8-a4ce-f8f2750385c2';

let reporter;

export function activate(context: ExtensionContext) {
    reporter = new TelemetryReporter(extensionPrefix, extensionVersion, key);
    context.subscriptions.push(reporter);

    const config: WorkspaceConfiguration = workspace.getConfiguration(extensionPrefix);
    const showExplorer: boolean = config.get(configurationSettings.showExplorer);
    const showExplorerDebug: boolean = config.get(configurationSettings.showExplorerDebug);
    const autoStart: boolean = config.get(configurationSettings.autoStart);
    const autoStartDelay: number = config.get(configurationSettings.autoStartDelay);
    const defaultSort: string = config.get(configurationSettings.defaultSort);

    reporter.sendTelemetryEvent('Extension Activated', {
        'showExplorer': showExplorer,
        'showExplorerDebug': showExplorerDebug,
        'autoStart': autoStart,
        'autoStartDelay': autoStartDelay,
        'defaultSort': defaultSort
    });

    setupActivityBarView(context, autoStart, autoStartDelay, defaultSort);

    if (showExplorer) {
        setupExplorerView(context, autoStart, autoStartDelay, defaultSort);
    }

    if (showExplorerDebug) {
        setupDebugView(context, autoStart, autoStartDelay, defaultSort);
    }
}

function setupDebugView(context: ExtensionContext, autoStart: boolean, autoStartDelay: number, defaultSort: string) {
    // Setup Tree Data Provider
    const symbolsTreeDataProvider = new SymbolsTreeDataProvider(context, View.Debug, autoStart, autoStartDelay, defaultSort, reporter);
    context.subscriptions.push(window.registerTreeDataProvider('symbolExplorerDebug', symbolsTreeDataProvider));

    // Setup Navigate Command
    const navigateSymbolCommand = commands.registerCommand('symbolExplorerDebug.navigateSymbol', range => { symbolsTreeDataProvider.select(range); });
    context.subscriptions.push(navigateSymbolCommand);

    // Setup Refresh Button
    const refreshSymbolCommand = commands.registerCommand('symbolExplorerDebug.refresh', () => symbolsTreeDataProvider.refresh());
    context.subscriptions.push(refreshSymbolCommand);

    // Setup Sort Asc Button
    const sortAscSymbolCommand = commands.registerCommand('symbolExplorerDebug.sortAsc', () => symbolsTreeDataProvider.refresh(Sort.asc));
    context.subscriptions.push(sortAscSymbolCommand);

    // Setup Sort Desc Button
    const sortDescSymbolCommand = commands.registerCommand('symbolExplorerDebug.sortDesc', () => symbolsTreeDataProvider.refresh(Sort.desc));
    context.subscriptions.push(sortDescSymbolCommand);

    // Setup Collapse Button
    // const collapseSymbolCommand = commands.registerCommand('symbolExplorerDebug.collapse', () => symbolsTreeDataProvider.refresh(Sort[defaultSort], true));
    // context.subscriptions.push(collapseSymbolCommand);
}

function setupExplorerView(context: ExtensionContext, autoStart: boolean, autoStartDelay: number, defaultSort: string) {
    // Setup Tree Data Provider
    const symbolsTreeDataProvider = new SymbolsTreeDataProvider(context, View.Explorer, autoStart, autoStartDelay, defaultSort, reporter);
    context.subscriptions.push(window.registerTreeDataProvider('symbolExplorer', symbolsTreeDataProvider));

    // Setup Navigate Command
    const navigateSymbolCommand = commands.registerCommand('symbolExplorer.navigateSymbol', range => { symbolsTreeDataProvider.select(range); });
    context.subscriptions.push(navigateSymbolCommand);

    // Setup Refresh Button
    const refreshSymbolCommand = commands.registerCommand('symbolExplorer.refresh', () => symbolsTreeDataProvider.refresh());
    context.subscriptions.push(refreshSymbolCommand);

    // Setup Sort Asc Button
    const sortAscSymbolCommand = commands.registerCommand('symbolExplorer.sortAsc', () => symbolsTreeDataProvider.refresh(Sort.asc));
    context.subscriptions.push(sortAscSymbolCommand);

    // Setup Sort Desc Button
    const sortDescSymbolCommand = commands.registerCommand('symbolExplorer.sortDesc', () => symbolsTreeDataProvider.refresh(Sort.desc));
    context.subscriptions.push(sortDescSymbolCommand);

    // Setup Collapse Button
    // const collapseSymbolCommand = commands.registerCommand('symbolExplorer.collapse', () => symbolsTreeDataProvider.refresh(Sort[defaultSort], true));
    // context.subscriptions.push(collapseSymbolCommand);
}

function setupActivityBarView(context: ExtensionContext, autoStart: boolean, autoStartDelay: number, defaultSort: string) {
    // Setup Tree Data Provider
    const symbolsTreeDataProvider = new SymbolsTreeDataProvider(context, View.View, autoStart, autoStartDelay, defaultSort, reporter);
    context.subscriptions.push(window.registerTreeDataProvider('symbolExplorerView', symbolsTreeDataProvider));

    // Setup Navigate Command
    const navigateSymbolCommand = commands.registerCommand('symbolExplorerView.navigateSymbol', range => { symbolsTreeDataProvider.select(range); });
    context.subscriptions.push(navigateSymbolCommand);

    // Setup Refresh Button
    const refreshSymbolCommand = commands.registerCommand('symbolExplorerView.refresh', () => symbolsTreeDataProvider.refresh());
    context.subscriptions.push(refreshSymbolCommand);

    // Setup Sort Asc Button
    const sortAscSymbolCommand = commands.registerCommand('symbolExplorerView.sortAsc', () => symbolsTreeDataProvider.refresh(Sort.asc));
    context.subscriptions.push(sortAscSymbolCommand);

    // Setup Sort Desc Button
    const sortDescSymbolCommand = commands.registerCommand('symbolExplorerView.sortDesc', () => symbolsTreeDataProvider.refresh(Sort.desc));
    context.subscriptions.push(sortDescSymbolCommand);

    // Setup Collapse Button
    // const collapseSymbolCommand = commands.registerCommand('symbolExplorerView.collapse', () => symbolsTreeDataProvider.refresh(Sort[defaultSort], true));
    // context.subscriptions.push(collapseSymbolCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {
    reporter.dispose();
}
