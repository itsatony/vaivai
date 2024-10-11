import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface VaivaiConfig {
    project_name: string;
    file_list: {
        output_file: string;
        base_dir: string;
        includes: string[];
        excludes: string[];
    };
    content_overview: {
        output_file: string;
        base_dir: string;
        includes: string[];
        excludes: string[];
    };
    file_type_mapping: { [key: string]: string };
    settings: {
        overwrite_existing_files: boolean;
    };
    error_logging: {
        log_file: string;
    };
}

export async function loadConfig(): Promise<VaivaiConfig | null> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('No workspace folder found.');
        return null;
    }

    const configPath = path.join(workspaceFolder.uri.fsPath, '.vaivai');

    try {
        const configContent = await fs.promises.readFile(configPath, 'utf8');
        return yaml.load(configContent) as VaivaiConfig;
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to load .vaivai configuration: ${(error as Error).message}`);
        return null;
    }
}

export async function getProjectName(configProjectName: string): Promise<string> {
    if (configProjectName) {
        return configProjectName;
    }

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        return 'Unknown Project';
    }

    try {
        const { stdout } = await execAsync('git config --get remote.origin.url', { cwd: workspaceFolder.uri.fsPath });
        const gitUrl = stdout.trim();
        if (gitUrl) {
            const match = gitUrl.match(/\/([^\/]+?)(\.git)?$/);
            return match ? match[1] : path.basename(workspaceFolder.uri.fsPath);
        }
    } catch (error) {
        // Git command failed, fallback to directory name
    }

    return path.basename(workspaceFolder.uri.fsPath);
}