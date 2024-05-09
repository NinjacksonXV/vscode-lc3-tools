// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

/** Template:
   "┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐"+
   "│ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │"+
   "└─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘"
 */

class LC3HoverProvider implements vscode.HoverProvider {
	public provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {

		// Not 100% sure that a big if-else block is the way to do this...
		// Using test() is the WRONG way to do this, as it's too lax. I have to do stupid
		// early returns to catch specific strings first before more broad ones, i.e. jsrr before jsr.

		let symbol = document.getText(document.getWordRangeAtPosition(position));
		console.log(symbol);
		if (RegExp("and", "i").test(symbol)) {
			let andDoc = new vscode.MarkdownString(
				// The display font is not monospaced, and the spaces mess it up.
				// "<p style=\"color: red;\">" +
				// "┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐\n\n" +
				// "│0 0 0 1│ DR  │ SR1 │0│0│0│ SR2 │\n\n" +
				// "└─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘\n\n" +
				// "				or				  \n\n" +
				// "┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐\n\n" +
				// "│0 0 0 1│ DR  │ SR1 │1│  imm5   │\n\n" +
				// "└─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘\n\n" +
				"If bit [5] is 0, the second source operand is obtained from SR2. If bit [5] is 1, the" +
				"second source operand is obtained by sign-extending the imm5 field to 16 bits." +
				"In both cases, the second source operand is added to the contents of SR1 and the" +
				"result stored in DR. The condition codes are set, based on whether the result is" +
				"negative, zero, or positive.\n\n" +
				"Examples:\n\n" +
				"ADD R2, R3, R4 ; R2 ← R3 + R4\n\n" +
				"ADD R2, R3, #7 ; R2 ← R3 + 7" //+
				// "</p>"
			);
			return new vscode.Hover(andDoc);
		}
		else if (RegExp("add", "i").test(symbol)) {
			return new vscode.Hover(
				"If bit [5] is 0, the second source operand is obtained from SR2. If bit [5] is 1,\n\n" +
				"the second source operand is obtained by sign-extending the imm5 field to 16\n\n" +
				"bits. In either case, the second source operand and the contents of SR1 are bitwise ANDed and the result stored in DR. The condition codes are set, based on\n\n" +
				"whether the binary value produced, taken as a 2’s complement integer, is negative,\n\n" +
				"zero, or positive.\n\n" +
				"Examples\n\n" +
				"AND R2, R3, R4 ;R2 ← R3 AND R4\n\n" +
				"AND R2, R3, #7 ;R2 ← R3 AND 7\n\n"
			);
		}
		else if (RegExp("br", "i").test(symbol)) {
			return new vscode.Hover(
				"The condition codes specified by bits[11: 9]are tested.If bit[11] is 1, N is tested;\n\n" +
				"if bit[11] is 0, N is not tested.If bit[10] is 1, Z is tested, etc. If any of the condition codes tested is 1, the program branches to the memory location specified by\n\n" +
				"adding the sign - extended PCoffset9 field to the incremented PC.\n\n" +
				"Examples\n\n" +
				"BRzp LOOP; Branch to LOOP if the last result was zero or positive.\n\n" +
				"BR† NEXT; Unconditionally branch to NEXT.\n\n"
			);
		}
		else if (RegExp("jmp", "i").test(symbol)) {
			return new vscode.Hover(
				"The program unconditionally jumps to the location specified by the contents of\n\n" +
				"the base register. Bits [8:6] identify the base register.\n\n" +
				"Examples\n\n" +
				"JMP R2 ; PC ← R2\n\n"
			);
		}
		else if (RegExp("jsrr", "i").test(symbol)) { // Here not to override jsr
			return new vscode.Hover("Didn't split this one up yet.");
		}
		else if (RegExp("jsr", "i").test(symbol)) {
			return new vscode.Hover("Didn't split this one up yet.");
		}
		else if (RegExp("ldi", "i").test(symbol)) {
			return new vscode.Hover(
				"An address is computed by sign-extending bits [8:0] to 16 bits and adding this\n\n" +
				"value to the incremented PC. What is stored in memory at this address is the\n\n" +
				"address of the data to be loaded into DR. If either address is to privileged memory and PSR[15]=1, initiate ACV exception. If not, the data is loaded and the\n\n" +
				"condition codes are set, based on whether the value loaded is negative, zero, or\n\n" +
				"positive.\n\n" +
				"Example\n\n" +
				"LDI R4, ONEMORE ; R4 ← mem[mem[ONEMORE]]\n\n"
			);
		}
		else if (RegExp("ldr", "i").test(symbol)) {
			return new vscode.Hover(
				"An address is computed by sign-extending bits [5:0] to 16 bits and adding this\n\n" +
				"value to the contents of the register specified by bits [8:6]. If the computed address\n\n" +
				"is to privileged memory and PSR[15]=1, initiate ACV exception. If not, the contents of memory at this address is loaded into DR. The condition codes are set,\n\n" +
				"based on whether the value loaded is negative, zero, or positive.\n\n" +
				"Example\n\n" +
				"LDR R4, R2, #−5 ; R4 ← mem[R2 − \n\n5]"
			);
		}
		else if (RegExp("ld", "i").test(symbol)) { // This is down here so that it doesn't take priority over the first two... stupid.
			return new vscode.Hover(
				"An address is computed by sign-extending bits [8:0] to 16 bits and adding\n\n" +
				"this value to the incremented PC. If the address is to privileged memory and\n\n" +
				"PSR[15]=1, initiate ACV exception. If not, the contents of memory at this address\n\n" +
				"is loaded into DR. The condition codes are set, based on whether the value loaded\n\n" +
				"is negative, zero, or positive.\n\n" +
				"Example\n\n" +
				"LD R4, VALUE ; R4 ← mem[VALUE]\n\n"
			);
		}
		else if (RegExp("lea", "i").test(symbol)) {
			return new vscode.Hover(
				"An address is computed by sign-extending bits [8:0] to 16 bits and adding this\n\n" +
				"value to the incremented PC. This address is loaded into DR.‡\n\n" +
				"Example\n\n" +
				"LEA R4, TARGET ; R4 ← address of TARGET.\n\n"
			);
		}
		else if (RegExp("not", "i").test(symbol)) {
			return new vscode.Hover(
				"The bit-wise complement of the contents of SR is stored in DR. The condition codes are set, based on whether the binary value produced, taken as a 2’s\n\n" +
				"complement integer, is negative, zero, or positive.\n\n" +
				"Example\n\n" +
				"NOT R4, R2 ; R4 ← NOT(R2)\n\n"
			);
		}
		else if (RegExp("ret", "i").test(symbol)) {
			return new vscode.Hover(
				"The PC is loaded with the contents of R7," +
				"which contains the linkage back to the instruction following the subroutine call instruction. Its normal use is to cause a return from a" +
				"previous JSR(R) instruction.\n\n" +
				"Examples\n\n" +
				"RET ; PC ← R7\n\n"
			);
		}
		else if (RegExp("rti", "i").test(symbol)) {
			return new vscode.Hover(
				"If the processor is running in User mode, a privilege mode exception occurs. If\n\n" +
				"in Supervisor mode, the top two elements on the system stack are popped and\n\n" +
				"loaded into PC, PSR. After PSR is restored, if the processor is running in User\n\n" +
				"mode, the SSP is saved in Saved SSP, and R6 is loaded with Saved USP.\n\n" +
				"Example\n\n" +
				"RTI ; PC, PSR ← top two values popped off stack\n\n"
			);
		}
		else if (RegExp("sti", "i").test(symbol)) {
			return new vscode.Hover(
				"If the computed address is to privileged memory and PSR[15]=1, initiate ACV\n\n" +
				"exception. If not, the contents of the register specified by SR is stored in the\n\n" +
				"memory location whose address is computed by sign-extending bits [5:0] to 16\n\n" +
				"bits and adding this value to the contents of the register specified by bits [8:6].\n\n" +
				"Example\n\n" +
				"STR R4, R2, #5 ; mem[R2+5] ← R4\n\n"
			);
		}
		else if (RegExp("str", "i").test(symbol)) {
			return new vscode.Hover(
				"If either computed address is to privileged memory and PSR[15]=1, initiate\n\n" +
				"ACV exception. If not, the contents of the register specified by SR is stored\n\n" +
				"in the memory location whose address is obtained as follows: Bits [8:0] are signextended to 16 bits and added to the incremented PC. What is in memory at this\n\n" +
				"address is the address of the location to which the data in SR is stored.\n\n" +
				"Example\n\n" +
				"STI R4, NOT HERE ; mem[mem[NOT HERE]] ← R4\n\n"
			);
		}
		else if (RegExp("st", "i").test(symbol)) { // This is down here so that it doesn't take priority over the first two... stupid.
			return new vscode.Hover(
				"If the computed address is to privileged memory and PSR[15]=1, initiate ACV\n\n" +
				"exception. If not, the contents of the register specified by SR is stored in the\n\n" +
				"memory location whose address is computed by sign-extending bits [8:0] to 16\n\n" +
				"bits and adding this value to the incremented PC.\n\n" +
				"Example\n\n" +
				"ST R4, HERE ; mem[HERE] ← R4\n\n"
			);
		}
		else if (RegExp("trap", "i").test(symbol)) {
			return new vscode.Hover(
				"If the the program is executing in User mode, the User Stack Pointer must be\n\n" +
				"saved and the System Stack Pointer loaded. Then the PSR and PC are pushed\n\n" +
				"on the system stack. (This enables a return to the instruction physically following the TRAP instruction in the original program after the last instruction in the\n\n" +
				"service routine (RTI) has completed execution.) Then the PC is loaded with the\n\n" +
				"starting address of the system call specified by trapvector8. The starting address\n\n" +
				"is contained in the memory location whose address is obtained by zero-extending\n\n" +
				"trapvector8 to 16 bits.\n\n" +
				"Example\n\n" +
				"TRAP x23 ; Directs the operating system to execute the IN system call.\n\n" +
				"; The starting address of this system call is contained in\n\n" +
				"; memory location x0023.\n\n"
			);
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

		const blkw = new vscode.CompletionItem(".BLKW");
		blkw.insertText = new vscode.SnippetString('${0:LABEL}\t.BLKW\t${1:1}');
		blkw.documentation = new vscode.MarkdownString("Reserve the specified number of memory locations");

		const end = new vscode.CompletionItem('.END');
		end.documentation = new vscode.MarkdownString("Tells the assembler where the program ends");

		const external = new vscode.CompletionItem('.EXTERNAL');
		external.insertText = new vscode.SnippetString('$.EXTERNAL\t\"${2}\"');
		external.documentation = new vscode.MarkdownString("Provide a path to an external program.");

		const fill = new vscode.CompletionItem('.FILL');
		fill.insertText = new vscode.SnippetString('${0:LABEL}\t.FILL\t${1}');
		fill.documentation = new vscode.MarkdownString("Reserve this memory location");

		const stringz = new vscode.CompletionItem('.STRINGZ');
		stringz.insertText = new vscode.SnippetString('${0:LABEL}\t.BLKW\t\"${1}\"');
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
			fill,
			stringz,
			external,
			header,
		];

	}
}

export function activate(context: vscode.ExtensionContext) {
	console.log(vscode.window.activeTerminal?.processId);

	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "lc3-assembly" is now active!');
	let binPath = vscode.workspace.getConfiguration('lc3tools').get('pathToExecutables');
	const lc3CompletionProvider = vscode.languages.registerCompletionItemProvider('lc3asm', new LC3CompletionProvider);
	const lc3HoverProvider = vscode.languages.registerHoverProvider('lc3asm', new LC3HoverProvider);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let assemble = vscode.commands.registerCommand('vscode-lc3-tools.assemble', () => {
		vscode.window.activeTextEditor?.document.save;
		if (vscode.window.activeTerminal?.name === "simulator") { vscode.window.activeTerminal?.sendText('quit'); }
		let filePath = vscode.window.activeTextEditor?.document.fileName;
		vscode.window.activeTerminal?.sendText(binPath + '\\assembler.exe ' + filePath);
	});

	let assembleAndRun = vscode.commands.registerCommand('vscode-lc3-tools.run', () => {
		vscode.window.activeTextEditor?.document.save;
		if (vscode.window.activeTerminal?.name === "simulator") { vscode.window.activeTerminal?.sendText('quit'); }
		let filePath = vscode.window.activeTextEditor?.document.fileName;
		vscode.window.activeTerminal?.sendText(binPath + '\\assembler.exe ' + filePath);
		let folder = filePath?.substring(0, filePath.lastIndexOf('\\'));
		let objectFile = filePath?.substring(filePath.lastIndexOf('\\'), filePath.lastIndexOf('.')) + '.obj';
		vscode.window.activeTerminal?.sendText(binPath + '\\simulator.exe ' + folder + objectFile);
	});

	// diagnosticCollection = vscode.languages.createDiagnosticCollection('lc3asm');

	context.subscriptions.push(assemble, assembleAndRun);
	// context.subscriptions.push(diagnosticCollection);
	context.subscriptions.push(lc3HoverProvider, lc3CompletionProvider);
}

export function deactivate() { }
