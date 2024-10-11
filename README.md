# Vaivai VSCode Extension

Vaivai is a VSCode extension designed to improve developer productivity for vaudience.ai teams. It provides functionality for generating file lists and content overviews based on configurable settings.

## Features

1. **Generate File List**: Creates a markdown file with a list of files in the project, based on include/exclude patterns.
2. **Generate Content Overview**: Creates a markdown file with the content of files in the project, based on include/exclude patterns.
3. **View Error Log**: Displays the error log for troubleshooting.
4. **Clear Error Log**: Clears the current error log.
5. **Initialize Configuration**: Creates a default .vaivai configuration file in the project root.

## Installation

1. Download the `.vsix` file from the latest release.
2. In VSCode, go to the Extensions view (Ctrl+Shift+X).
3. Click on the "..." at the top of the Extensions view.
4. Choose "Install from VSIX..." and select the downloaded file.

## Configuration

To initialize the Vaivai configuration:

1. Open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P on Mac).
2. Run the "Vaivai: Initialize Configuration" command.
3. This will create a `.vaivai` file in your project root with default settings.

You can then modify the `.vaivai` file to suit your project needs. The configuration file has the following structure:

```yaml
project_name: "" # Leave empty to auto-detect from git or root directory name

file_list:
  output_file: "filelist.md"
  base_dir: "."
  includes:
    - "*.go"
    - "*.py"
  excludes:
    - ".git/**"
    - "vendor/**"

content_overview:
  output_file: "content_overview.md"
  base_dir: "."
  includes:
    - "*.go"
    - "*.py"
  excludes:
    - ".git/**"
    - "vendor/**"

file_type_mapping:
  ".go": "go"
  ".py": "python"
  # Add more mappings as needed

settings:
  overwrite_existing_files: true

error_logging:
  log_file: ".vaivai_errors.log"
```

## Usage

- To initialize the Vaivai configuration: Run the "Vaivai: Initialize Configuration" command from the command palette.
- To generate a file list: Press `Ctrl+Alt+F` (Cmd+Alt+F on Mac) or run the "Vaivai: Generate File List" command from the command palette.
- To generate a content overview: Press `Ctrl+Alt+O` (Cmd+Alt+O on Mac) or run the "Vaivai: Generate Content Overview" command from the command palette.
- To view the error log: Run the "Vaivai: View Error Log" command from the command palette.
- To clear the error log: Run the "Vaivai: Clear Error Log" command from the command palette.

## Building the Extension

To compile and package the extension, we provide a build script. Follow these steps:

1. Ensure you have Node.js and npm installed on your system.
2. Navigate to the root directory of the project in your terminal.
3. Make the build script executable:

   ```terminal
   chmod +x build.sh
   ```

4. Run the build script:

   ```terminal
   ./build.sh
   ```

The script will install dependencies, compile the TypeScript code, run tests, and package the extension into a .vsix file. If successful, you'll find the .vsix file in the project root directory.

...

## Troubleshooting

If you encounter any issues, check the error log by running the "Vaivai: View Error Log" command. If the problem persists, please report the issue on the project's GitHub page.

## Contributing

dont worry about it

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
