# Flight for Visual Studio Code

Opening a `.flight` file uses the Flight visual editor by default. Use the editor-title button or the commands `Flight: Open Source` and `Flight: Open Visual Editor` to move between the JSON source and visual navigation.

The VS Code text document is the source of truth. The visual editor listens to document revisions, so changes from the source editor, disk reloads, formatters, Git operations, and other extensions are reflected without reopening the tab.

Build from this directory with `npm run build`. During development, open this directory in VS Code and run the extension host launch configuration.
