# vscode-lc3-tools

Work-in-progress [LC3Tools](https://github.com/chiragsakhuja/lc3tools/tree/master) integration into VS Code, including file editing, autocomplete, assembly/running, linting (WIP), and more.

*Development version only.* Releases are not available yet.

## Features

The feature-set is very slim right now. Many are planned, however.

### Current
- Basic syntax highlighting
- Basic snippets
- Some documentation shown when hovering over an opcode
- Commands to assemble and run the currently opened file with the LC3Tools command line tools.

### Planned

- Direct integration with the LC3Tools CPP interface
  - Assembly error-checking during editing
  - Error highlighting
  - Program output sent to custom stream 
- More advanced snippets and diagnostics
  - Error-based const/label replacement, i.e. if a constant value is >5 bits, offer a snippet that replaces it with a label.
- More advanced syntax highlighting
  - Per-register coloring for better readability
- More robust documentation for opcodes
- **UNDECIDED**: Recreating the LC3Tools GUI with the VSCode GUI API... a major undertaking for when all else is complete.
## Requirements

Currently, it is required to build LC3Tools for your platform in order to assemble and run the files via the VSCode command palette. 

## Extension Settings

**`lc3tools.pathToExecutables`** - Path to the folder containing the compiled command-line tools, i.e. `simulator.exe` and `assembler.exe`. 

## Known Issues

- Hardcoded to work on Windows exclusively
- Syntax highlighting has some odd behaviors, especially with constants
- Hover token parsing is a tad wonky (language word definitions are to blame)
  - Related, but hover documentation currently has weird spacing issues, so bitwise representation of the opcode is not currently possible. It's also just... horribly formatted.
- There's no way *not* to use labels with any pseudo-op snippet. Haven't figured out how to work with cancellation tokens properly. 
- And more... Too many to count :)

## Release Notes

WIP