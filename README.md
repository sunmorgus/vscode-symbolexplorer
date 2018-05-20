# Symbol Explorer

A simple vscode extension to provide an explorer view of the symbols in the active document.

## Features

- Views for Explorer, Debugger, and a separate Activity Bar view of it's own!
- Lists all symbols in the active document
- Sort symbols alphabetically (default sort order can be set in preferences)
- Symbols are grouped by container (i.e. methods within a class are grouped under that class) (default state can be set in preferences)
- Symbols update automatically when your document is saved
- Refresh the list

### Explorer View

![screenshot](screenshots/_Extension_Development_Host__-_extension_ts_—_vscode-azureappservice.png)

### Activity Bar

![screenshot](screenshots/_Extension_Development_Host__-_Startup_cs_—_symbolexplorer-screenshot-project.png)

## Configuration

- `vscode-symbolexplorer.showExplorer`: Show or hide Symbol Explorer in Explorer View (defaults to true, requires window reload)
- `vscode-symbolexplorer.showExplorerDebug`: Show or hide the Symbol Explorer in Debug View (defaults to false, requires window reload)
- `vscode-symbolexplorer.autoStart`: Whether to auto-check for symbols on start up
- `vscode-symbolexplorer.autoStartDelay`: Delay auto-start to allow language server to start
- `vscode-symbolexplorer.defaultSort`: Choose default sort direction (`none`, `asc`, `desc`) for the symbols in the view
- `vscode-symbolexplorer.defaultState`: Choose default state of parent symbols (`expanded` [default], `collapsed`)

## Requirements

The only requirement is having a document open that supports symbols.

## Known Issues

- Code complexity scoring has only been tested on C# and may not yet work properly in other languages
- Depending on what extension is providing the symbols for your file, you may have to hit the refresh button after the extension has finished loading (for instance, with the C# extension, once omnisharp has finished loading your project)
    - Adjusting the `autoStartDelay` setting can help with this

## Contributions

- Icon provided by [Font Awesome](https://fontawesome.com/icons/space-shuttle?style=solid) ([License](https://fontawesome.com/license))

## Release Notes

See Changelog

## Todo:

1. Ability to reorganize you code with drag and drop
1. Code complexity scoring for individual symbols
1. Ability to group symbols with regions (if the current document supports regions)
