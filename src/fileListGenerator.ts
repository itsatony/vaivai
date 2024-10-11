import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import { promisify } from 'util';
import { VaivaiConfig } from './config';

const globPromise = promisify(glob);

export async function generateFileList(config: VaivaiConfig, projectName: string): Promise<void> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        throw new Error('No workspace folder found.');
    }

    const baseDir = path.join(workspaceFolder.uri.fsPath, config.file_list.base_dir);
    const outputPath = path.join(baseDir, config.file_list.output_file);

    const files = await getFilteredFiles(baseDir, config.file_list.includes, config.file_list.excludes);

    const content = generateMarkdownContent(files, projectName);

    await fs.promises.writeFile(outputPath, content, 'utf8');
}

async function getFilteredFiles(baseDir: string, includes: string[], excludes: string[]): Promise<string[]> {
    const allFiles = await Promise.all(includes.map(pattern => 
        globPromise(pattern, { cwd: baseDir, nodir: true })
    ));

    const flattenedFiles = allFiles.flat();

    const excludedFiles = await Promise.all(excludes.map(pattern =>
        globPromise(pattern, { cwd: baseDir, nodir: true })
    ));

    const flattenedExcludes = new Set(excludedFiles.flat());

    return flattenedFiles.filter(file => !flattenedExcludes.has(file));
}

function generateMarkdownContent(files: string[], projectName: string): string {
    const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    let content = `## Filepaths for project ${projectName}\n`;
    content += `Generated on: ${timestamp}\n\n`;

    for (const file of files) {
        content += `* ${file}\n`;
    }

    return content;
}