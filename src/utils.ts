import { SymbolInformation, Range, TextDocument } from "vscode";

export class Utils {
    calculateComplexity(functionText: string): number {
        // Rip out single line comments
        functionText = functionText.replace(/\/\/.*/g, "\n");

        // Rip out multi-line comments
        functionText = functionText.replace(/\*.*?\*/g, "");

        // Rip out strings
        functionText = functionText.replace(/""[^""]*""/g, "");

        // Rip out characters
        functionText = functionText.replace(/'[^']*'/g, "");

        // Count things
        const ifCount = (functionText.match(/\sif[\s\(]/g) || []).length;
        const elseCount = (functionText.match(/\selse\s/g) || []).length;
        const elseIfCount = (functionText.match(/\selse if[\s\(]/g) || []).length;
        const whileCount = (functionText.match(/\swhile[\s\(]/g) || []).length;
        const forCount = (functionText.match(/\sfor[\s\(]/g) || []).length;
        const forEachCount = (functionText.match(/\sforeach[\s\(]/g) || []).length;
        const switchCount = (functionText.match(/\sswitch[\s\(]/g) || []).length;
        const caseCount = (functionText.match(/\scase\s[^;]*;/g) || []).length;
        const catchCount = (functionText.match(/\scatch[\s\(]/g) || []).length;
        const tertiaryCount = (functionText.match(/\s\?\s/g) || []).length;
        const andCount = (functionText.match(/\&\&/g) || []).length;
        const orCount = (functionText.match(/\|\|/g) || []).length;

        const complexity = 1 +
            ifCount + elseCount - elseIfCount + // else if will have been counted twice already by 'if' and 'else'
            whileCount + forCount + forEachCount + switchCount + caseCount +
            catchCount + tertiaryCount + andCount + orCount;

        return complexity;
    }

    getCodeBlocks(symbol: SymbolInformation, document: TextDocument): string {
        let tabSize = 4; // need to get the actual tab size from settings
        let pattern = new RegExp(` {${tabSize}}| {0,${tabSize - 1}}\t`, "g");
        let block: Range;

        let startLineNumber: number = symbol.location.range.start.line;
        let endLineNumber: number;

        let text = document.lineAt(startLineNumber).text;
        let lineMatch = text.match(pattern);

        if (lineMatch && lineMatch.length > 0) {
            let lineIndent = lineMatch.length;
            switch (symbol.kind) {
                case 5: // method
                    let nextLineNumber = startLineNumber + 2; // class opening brace should be on the next line, we can check for that later though
                    let currentText = document.lineAt(nextLineNumber).text;
                    let currentLineMatch = currentText.match(pattern);
                    if (currentLineMatch && currentLineMatch.length > 0) {
                        let currentLineIndent = currentLineMatch.length;

                        while (currentLineIndent > lineIndent) {
                            nextLineNumber++;
                            currentText = document.lineAt(nextLineNumber).text;
                            currentLineMatch = currentText.match(pattern);
                            if (currentLineMatch && currentLineMatch.length > 0) {
                                currentLineIndent = currentLineMatch.length;
                            }
                        }

                        endLineNumber = nextLineNumber;
                        block = new Range(startLineNumber, 0, endLineNumber, currentText.length);
                    }
                    break;
            }
        }

        if (block) {
            let textBlock = document.getText(block);
            return textBlock;
        }

        return "";
    }
}
