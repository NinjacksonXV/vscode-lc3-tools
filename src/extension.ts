// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

let diagnosticCollection: vscode.DiagnosticCollection;

class LC3HoverProvider implements vscode.HoverProvider {
	public provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {

		let symbol = document.getText(document.getWordRangeAtPosition(position));
		console.log(symbol);
		if (RegExp("and", "i").test(symbol)) {
			return new vscode.Hover("Howdy!");
		}
		else if (RegExp("add", "i").test(symbol)) {
			return new vscode.Hover("Hello there!");
		}
		else { return null; };
	}
}

class LC3CompletionProvider implements vscode.CompletionItemProvider {

	public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>> {

		token.onCancellationRequested(function (event) { console.log('event happened ' + event); });
		const add = new vscode.CompletionItem('ADD', vscode.CompletionItemKind.Operator);
		add.insertText = new vscode.SnippetString('ADD\tR${1:-A}, R${2:-B}, ${0:C}');
		add.detail = "ADD R-A, R-B, (R-)C";
		add.documentation = new vscode.MarkdownString("Register `A` = Register `B` + `C` (5 bit const or register)");

		const and = new vscode.CompletionItem('AND', vscode.CompletionItemKind.Operator);
		and.insertText = new vscode.SnippetString('AND\tR${1:-A},\tR${2:-B},\t${0:C}');
		and.detail = "AND R-A, R-B, (R-)C";
		and.documentation = new vscode.MarkdownString("Register `A` = Register `B` AND `C` (5-bit const or register)");

		const br = new vscode.CompletionItem('BR');
		br.insertText = new vscode.SnippetString('BR${1:nzp}\t${0:LABEL}');
		br.detail = "BRnzp LABEL";
		br.documentation = new vscode.MarkdownString("Branch to `LABEL` based on **N**egative, **Z**ero, and **P**ositive flags");

		const jmp = new vscode.CompletionItem('JMP');
		jmp.insertText = new vscode.SnippetString('JMP\tR${0:-A}');
		jmp.detail = "LD R-A, LABEL";
		jmp.documentation = new vscode.MarkdownString("Unconditionally jump to the memory address stored in register `A`");

		const jsr = new vscode.CompletionItem('JSR');
		jsr.insertText = new vscode.SnippetString('JSR\t${0:LABEL}');
		jsr.detail = "JSRR, LABEL";
		jsr.documentation = new vscode.MarkdownString("Unconditionally jump to the memory address pointed to by `LABEL`, storing the following address in R7");

		const jsrr = new vscode.CompletionItem('JSRR');
		jsrr.insertText = new vscode.SnippetString('JSRR\tR${0:-A}');
		jsrr.detail = "JSRR, R-A";
		jsrr.documentation = new vscode.MarkdownString("Unconditionally jump to the address pointed to by register `A`, storing the following address in R7");

		const ld = new vscode.CompletionItem('LD', vscode.CompletionItemKind.Keyword);
		ld.insertText = new vscode.SnippetString('LD\tR${1:-A},\t${0:LABEL}');
		ld.detail = "LD R-A, LABEL";
		ld.documentation = new vscode.MarkdownString("Load the value found in stored at `LABEL` in register `A`");

		const ldi = new vscode.CompletionItem('LDI');
		ldi.insertText = new vscode.SnippetString('LDI\tR${1:-A},\t${0:LABEL}');
		ldi.detail = "LDI R-A, LABEL";
		ldi.documentation = new vscode.MarkdownString("Load the value found in the address pointed to by `LABEL` into register `A`");

		const ldr = new vscode.CompletionItem('LDR');
		ldr.insertText = new vscode.SnippetString('LDR\tR${2:-A},\tR${1:-B},\t${0:OFFSET}');
		ldr.detail = "LDR R-A, R-B, OFFSET";
		ldr.documentation = new vscode.MarkdownString("Load the value stored in the address pointed to by R`B` + 6-bit offset into R`A`");

		const lea = new vscode.CompletionItem('LEA');
		lea.insertText = new vscode.SnippetString('LEA\tR${1:-A},\t${0:LABEL}');
		lea.detail = "LEA R-A, LABEL";
		lea.documentation = new vscode.MarkdownString("Load the address of the `LABEL` into register `A`");

		const not = new vscode.CompletionItem('NOT', vscode.CompletionItemKind.Operator);
		not.insertText = new vscode.SnippetString('NOT\tR${1:-A},\tR${0:-B}');
		not.detail = "NOT R-A, R-B";
		not.documentation = new vscode.MarkdownString("Register `A` = NOT Register `B`");

		const ret = new vscode.CompletionItem('RET');
		ret.documentation = new vscode.MarkdownString("Return from previous JSR(R) instruction.");

		const rti = new vscode.CompletionItem('RTI');
		rti.documentation = new vscode.MarkdownString("Return from TRAP service routine, restoring the PC and PSR");

		const st = new vscode.CompletionItem('ST');
		st.insertText = new vscode.SnippetString('ST\tR${1:-A},\t${0:LABEL}');
		st.detail = "ST R-A, LABEL";
		st.documentation = new vscode.MarkdownString("Store the value of register `A` in `LABEL`");

		const sti = new vscode.CompletionItem('STI');
		sti.insertText = new vscode.SnippetString('STI\tR${1:-A},\t${0:LABEL}');
		sti.detail = "STI R-A, LABEL";
		sti.documentation = new vscode.MarkdownString("Store the value found in register 'A' into the address stored in `LABEL`");

		const str = new vscode.CompletionItem('STR');
		str.insertText = new vscode.SnippetString('STR\tR${2:-A},\tR${1:-B},\t${0:OFFSET}');
		str.documentation = new vscode.MarkdownString("Store the value in R'A' into the address found in R'2' + 6-bit offset");

		// TRAP subroutines
		const trap = new vscode.CompletionItem('TRAP');
		trap.insertText = new vscode.SnippetString('TRAP\t${VECT}');
		trap.documentation = new vscode.MarkdownString("Run the TRAP routine pointed to by `VECT`");
		const trap_getc = new vscode.CompletionItem('GETC');
		trap_getc.documentation = "Read a single character from the keyboard into R0";
		const trap_out = new vscode.CompletionItem('OUT');
		trap_out.documentation = "Write a character in R0 to the console";
		const trap_puts = new vscode.CompletionItem('PUTS');
		trap_puts.documentation = "Write a string of stored ASCII characters to the console, starting in R0";
		const trap_in = new vscode.CompletionItem('IN');
		trap_in.documentation = "Print a prompt to the screen, then read and echo a single character from the keyboard";
		const trap_putsp = new vscode.CompletionItem('PUTSP');
		trap_in.documentation = "Print a string of ASCII characters, with two characters per memory location, starting in R0";
		const trap_halt = new vscode.CompletionItem('HALT');
		trap_halt.documentation = "Halt execution and print a message on the console.";

		// Assembler directives
		/** TO-DO:
		 *  -[x] Figure out how to get the snippet to appear when typing "." For now, it fails and only appears with every other character, which messes it up.
		 *  - Check for cancellation on any preprocessor directive that uses a label, which erases the label and the tab. 
		 *  - Add completionItemKinds to each item. Low priority. 
		 */
		const orig = new vscode.CompletionItem('.ORIG');
		orig.insertText = new vscode.SnippetString('.ORIG\tx${1:3000}\n\t$0\n.END');
		orig.documentation = new vscode.MarkdownString("Tells the assembler where the program begins and ends");

		const blkw = new vscode.CompletionItem(".BLKW", vscode.CompletionItemKind.Keyword);
		blkw.insertText = new vscode.SnippetString('${0:LABEL}\t.BLKW\t${1:1}');
		blkw.documentation = new vscode.MarkdownString("Reserve the specified number of memory locations");

		const end = new vscode.CompletionItem('.END');
		end.documentation = new vscode.MarkdownString("Tells the assembler where the program ends");

		const external = new vscode.CompletionItem('.EXTERNAL');
		external.insertText = new vscode.SnippetString('$.EXTERNAL\t${2:1}${0}');
		external.documentation = new vscode.MarkdownString("Provide a path to an external program.");

		const fill = new vscode.CompletionItem('.FILL');
		fill.insertText = new vscode.SnippetString('${1:LABEL}\t.BLKW\t${2:1}${0}');
		fill.documentation = new vscode.MarkdownString("Reserve this memory location");

		const stringz = new vscode.CompletionItem('.STRINGZ');
		stringz.insertText = new vscode.SnippetString('${1:LABEL}\t.BLKW\t${2:1}${0}');
		stringz.documentation = new vscode.MarkdownString("Reserve the specified number of memory locations");


		const header = new vscode.CompletionItem(';**');
		header.insertText = "; **********************************\n" +
			";\n;\n" +
			"; Register Dictionary\n" +
			"; R1: \n" +
			"; R2: \n" +
			"; R3: \n" +
			"; R4: \n" +
			"; **********************************\n";

		return [
			add,
			and,
			br,
			jsr,
			jsrr,
			ld,
			ldi,
			ldr,
			lea,
			not,
			ret,
			rti,
			st,
			sti,
			str,
			trap,
			trap_getc,
			trap_out,
			trap_puts,
			trap_in,
			trap_putsp,
			trap_halt,
			orig,
			blkw,
			header
		];

	}
}

export function activate(context: vscode.ExtensionContext) {

	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "lc3-assembly" is now active!');

	const lc3CompletionProvider = vscode.languages.registerCompletionItemProvider('lc3asm', new LC3CompletionProvider);
	const lc3HoverProvider = vscode.languages.registerHoverProvider('lc3asm', new LC3HoverProvider);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vscode-lc3-tools.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from LC3 Assembly!');
	});

	diagnosticCollection = vscode.languages.createDiagnosticCollection('lc3asm');

	context.subscriptions.push(disposable);
	context.subscriptions.push(diagnosticCollection);
	context.subscriptions.push(lc3HoverProvider, lc3CompletionProvider);
}

// function onChange()
// {
// 	let uri = vscode.window.activeTextEditor?.document.uri;
// 	check(uri?.fsPath, )
// }

// This method is called when your extension is deactivated
export function deactivate() { }
