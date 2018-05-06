'use strict';

import * as vscode from "vscode";
import * as path from 'path';
import { Utils } from './globals/utils';
import { View, SymbolKind } from "./globals/enums";

export class SymbolsTreeDataProvider implements vscode.TreeDataProvider<vscode.SymbolInformation> {
    private _onDidChangeTreeData: vscode.EventEmitter<vscode.SymbolInformation | undefined> = new vscode.EventEmitter<vscode.SymbolInformation | undefined>();
    readonly onDidChangeTreeData: vscode.Event<vscode.SymbolInformation | undefined> = this._onDidChangeTreeData.event;

    private autoRefresh: boolean = true;
    private editor: vscode.TextEditor;
    private symbols: Array<vscode.SymbolInformation>;
    private utils: Utils;

    constructor(private context: vscode.ExtensionContext, private activeView: View) {
        this.utils = new Utils();
        vscode.window.onDidChangeActiveTextEditor(() => this.onActiveEditorChanged());
        vscode.workspace.onDidSaveTextDocument(() => this.onDocumentChanged());
        this.onActiveEditorChanged();
    }

    refresh(): void {
        this.editor = vscode.window.activeTextEditor;
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: vscode.SymbolInformation): vscode.TreeItem {
        let symbolTreeViewItem: SymbolTreeViewItem;

        let codeComplexity = 0;
        if (element.kind == 5 || element.kind == 11) {
            let utils = new Utils();
            let codeBlock = utils.getCodeBlocks(element, this.editor.document);
            codeComplexity = utils.calculateComplexity(codeBlock);
        }

        if (element.containerName === "") {
            const hasChildren: boolean = this.symbols.some(symbol => {
                return symbol.containerName === element.name;
            });

            symbolTreeViewItem = new SymbolTreeViewItem(element.name, codeComplexity, element.kind, element.location, hasChildren ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None, this.context);
        }
        else {
            symbolTreeViewItem = new SymbolTreeViewItem(element.name, codeComplexity, element.kind, element.location, vscode.TreeItemCollapsibleState.None, this.context);
        }

        let command: string;

        switch (this.activeView) {
            case 0:
                command = 'symbolExplorer.navigateSymbol';
                break;
            case 1:
                command = 'symbolExplorerDebug.navigateSymbol';
                break;
            case 2:
                command = 'symbolExplorerView.navigateSymbol';
                break;
        }

        symbolTreeViewItem.command = {
            command: command,
            title: '',
            arguments: [element.location.range]
        }

        return symbolTreeViewItem;
    }

    getChildren(element: vscode.SymbolInformation): Thenable<vscode.SymbolInformation[]> {
        if (element) {
            // element is a container, so we find the child items
            return new Promise(resolve => {
                const childSymbols: Array<vscode.SymbolInformation> = this.symbols.filter(symbol => {
                    return symbol.containerName === element.name;
                });

                resolve(childSymbols);
            })
        }
        else {
            // element
            return new Promise(resolve => {
                this.utils.getSymbolsForActiveEditor(this.editor).then(sortedSymbols => {
                    this.symbols = sortedSymbols;

                    const parentSymbols: Array<vscode.SymbolInformation> = sortedSymbols.filter(symbol => {
                        return symbol.containerName === "";
                    });

                    if (parentSymbols.length > 0) {
                        resolve(parentSymbols);
                    }

                    resolve(sortedSymbols);
                }).catch(reject => {
                    reject();
                })
            });
        }
    }

    select(range: vscode.Range) {
        this.editor.selection = new vscode.Selection(range.start, range.end);
        vscode.commands.executeCommand<Array<vscode.SymbolInformation>>(
            'revealLine',
            {
                lineNumber: range.start.line,
                at: 'center'
            }
        );
    }

    private onActiveEditorChanged(): void {
        if (vscode.window.activeTextEditor) {
            if (vscode.window.activeTextEditor.document.uri.scheme === 'file') {
                this.refresh();
            }
        }
    }

    private onDocumentChanged(): void {
        if (this.autoRefresh)
            this._onDidChangeTreeData.fire();
    }
}

class SymbolTreeViewItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly complexity: number,
        private kind: number,
        public readonly location: vscode.Location | undefined,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        private context: vscode.ExtensionContext,
        public command?: vscode.Command
    ) {
        super(label, collapsibleState);
    }

    get tooltip(): string {
        const name = this.toCssClassName(this.kind);
        return this.complexity > 0 ? `Kind: ${name} - Complexity: ${this.complexity}` : `Kind: ${name}`;
    }

    private getIconPath(): { light: string, dark: string } {
        const name = this.toCssClassName(this.kind);
        const iconPaths = {
            light: this.context.asAbsolutePath(path.join('resources', 'light', `${name}.svg`)),
            dark: this.context.asAbsolutePath(path.join('resources', 'dark', `${name}.svg`))
        };
        return iconPaths;
    }

    iconPath = this.getIconPath();

    contextValue = 'symbolTreeViewItem';

    private toCssClassName(kind: SymbolKind): string {
        const _fromMapping: { [n: number]: string } = Object.create(null);
        _fromMapping[SymbolKind.File] = 'file';
        _fromMapping[SymbolKind.Module] = 'object';
        _fromMapping[SymbolKind.Namespace] = 'object';
        _fromMapping[SymbolKind.Package] = 'object';
        _fromMapping[SymbolKind.Class] = 'class';
        _fromMapping[SymbolKind.Method] = 'method';
        _fromMapping[SymbolKind.Property] = 'property';
        _fromMapping[SymbolKind.Field] = 'field';
        _fromMapping[SymbolKind.Constructor] = 'method';
        _fromMapping[SymbolKind.Enum] = 'enum';
        _fromMapping[SymbolKind.Interface] = 'interface';
        _fromMapping[SymbolKind.Function] = 'method';
        _fromMapping[SymbolKind.Variable] = 'field';
        _fromMapping[SymbolKind.Constant] = 'constant';
        _fromMapping[SymbolKind.String] = 'key';
        _fromMapping[SymbolKind.Number] = 'number';
        _fromMapping[SymbolKind.Boolean] = 'null';
        _fromMapping[SymbolKind.Array] = 'array';
        _fromMapping[SymbolKind.Object] = 'object';
        _fromMapping[SymbolKind.Key] = 'key';
        _fromMapping[SymbolKind.Null] = 'null';
        _fromMapping[SymbolKind.EnumMember] = 'enum-member';
        _fromMapping[SymbolKind.Struct] = 'struct';
        _fromMapping[SymbolKind.Event] = 'event';
        _fromMapping[SymbolKind.Operator] = 'operator';
        _fromMapping[SymbolKind.TypeParameter] = 'type-parameter';
        return _fromMapping[kind] || 'property';
    };
}
