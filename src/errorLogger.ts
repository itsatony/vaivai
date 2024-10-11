import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let errorLogPath: string | null = null;

export function initializeErrorLogger(logFilePath: string): void {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('No workspace folder found for error logging.');
        return;
    }

    errorLogPath = path.join(workspaceFolder.uri.fsPath, logFilePath);
}

export async function appendToErrorLog(errorMessage: string): Promise<void> {
    if (!errorLogPath) {
        vscode.window.showErrorMessage('Error log path not initialized.');
        return;
    }

    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${errorMessage}\n`;

    try {
        await fs.promises.appendFile(errorLogPath, logEntry, 'utf8');
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to write to error log: ${error.message}`);
    }
}

export async function getErrorLog(): Promise<string> {
    if (!errorLogPath) {
        throw new Error('Error log path not initialized.');
    }

    try {
        return await fs.promises.readFile(errorLogPath, 'utf8');
    } catch (error) {
        if (error.code === 'ENOENT') {
            return 'No errors logged yet.';
        }
        throw error;
    }
}

export async function clearErrorLog(): Promise<void> {
    if (!errorLogPath) {
        throw new Error('Error log path not initialized.');
    }

    try {
        await fs.promises.writeFile(errorLogPath, '', 'utf8');
    } catch (error) {
        throw new Error(`Failed to clear error log: ${error.message}`);
    }
}