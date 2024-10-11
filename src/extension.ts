import * as vscode from 'vscode';
import { generateFileList } from './fileListGenerator';
import { generateContentOverview } from './contentOverviewGenerator';
import { loadConfig, getProjectName } from './config';
import { initializeErrorLogger, appendToErrorLog, getErrorLog, clearErrorLog } from './errorLogger';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    console.log('Vaivai extension is now active');

    let disposable1 = vscode.commands.registerCommand('vaivai.generateFileList', async () => {
        try {
            const config = await loadConfig();
            if (!config) {
                vscode.window.showErrorMessage('Failed to load .vaivai configuration file.');
                return;
            }

            initializeErrorLogger(config.error_logging.log_file);
            const projectName = await getProjectName(config.project_name);
            await generateFileList(config, projectName);
            vscode.window.showInformationMessage('File list generated successfully.');
        } catch (error) {
            handleError('Error generating file list', error);
        }
    });

    let disposable2 = vscode.commands.registerCommand('vaivai.generateContentOverview', async () => {
        try {
            const config = await loadConfig();
            if (!config) {
                vscode.window.showErrorMessage('Failed to load .vaivai configuration file.');
                return;
            }

            initializeErrorLogger(config.error_logging.log_file);
            const projectName = await getProjectName(config.project_name);
            await generateContentOverview(config, projectName);
            vscode.window.showInformationMessage('Content overview generated successfully.');
        } catch (error) {
            handleError('Error generating content overview', error);
        }
    });

    let disposable3 = vscode.commands.registerCommand('vaivai.viewErrorLog', async () => {
        try {
            const errorLog = await getErrorLog();
            const doc = await vscode.workspace.openTextDocument({
                content: errorLog,
                language: 'log'
            });
            await vscode.window.showTextDocument(doc);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to view error log: ${(error as Error).message}`);
        }
    });
    
    let disposable4 = vscode.commands.registerCommand('vaivai.clearErrorLog', async () => {
        try {
            await clearErrorLog();
            vscode.window.showInformationMessage('Error log cleared successfully.');
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to clear error log: ${(error as Error).message}`);
        }
    });

    let disposable5 = vscode.commands.registerCommand('vaivai.initConfig', async () => {
        try {
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
                vscode.window.showErrorMessage('No workspace folder found.');
                return;
            }

            const defaultConfigPath = path.join(context.extensionPath, 'default.vaivai');
            const targetConfigPath = path.join(workspaceFolder.uri.fsPath, '.vaivai');

            if (fs.existsSync(targetConfigPath)) {
                const overwrite = await vscode.window.showQuickPick(['Yes', 'No'], {
                    placeHolder: 'A .vaivai file already exists. Do you want to overwrite it?'
                });
                if (overwrite !== 'Yes') {
                    vscode.window.showInformationMessage('Vaivai configuration initialization cancelled.');
                    return;
                }
            }

            fs.copyFileSync(defaultConfigPath, targetConfigPath);
            vscode.window.showInformationMessage('Vaivai configuration initialized successfully.');
        } catch (error) {
            handleError('Error initializing Vaivai configuration', error);
        }
    });

    context.subscriptions.push(disposable1, disposable2, disposable3, disposable4, disposable5);
}

function handleError(message: string, error: any) {
    const errorMessage = `${message}: ${error.message}`;
    vscode.window.showErrorMessage(errorMessage);
    appendToErrorLog(errorMessage);
}

export function deactivate() {}