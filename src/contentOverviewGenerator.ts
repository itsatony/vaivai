import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import { VaivaiConfig } from './config';

export async function generateContentOverview(config: VaivaiConfig, projectName: string): Promise<void> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        throw new Error('No workspace folder found.');
    }

    const baseDir = path.join(workspaceFolder.uri.fsPath, config.content_overview.base_dir);
    const outputPath = path.join(baseDir, config.content_overview.output_file);

    const files = await getFilteredFiles(baseDir, config.content_overview.includes, config.content_overview.excludes);

    const content = await generateMarkdownContent(files, projectName, baseDir, config.file_type_mapping);

    await fs.promises.writeFile(outputPath, content, 'utf8');
}

async function getFilteredFiles(baseDir: string, includes: string[], excludes: string[]): Promise<string[]> {
    const allFiles = await Promise.all(includes.map(pattern => 
        new Promise<string[]>((resolve, reject) => {
            glob(pattern, { cwd: baseDir, nodir: true }, (err, matches) => {
                if (err) reject(err);
                else resolve(matches);
            });
        })
    ));

    const flattenedFiles = allFiles.flat();

    const excludedFiles = await Promise.all(excludes.map(pattern =>
        new Promise<string[]>((resolve, reject) => {
            glob(pattern, { cwd: baseDir, nodir: true }, (err, matches) => {
                if (err) reject(err);
                else resolve(matches);
            });
        })
    ));

    const flattenedExcludes = new Set(excludedFiles.flat());

    return flattenedFiles.filter(file => !flattenedExcludes.has(file));
}

async function generateMarkdownContent(
    files: string[], 
    projectName: string, 
    baseDir: string, 
    fileTypeMapping: { [key: string]: string }
): Promise<string> {
    const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    let content = `# Project Overview: ${projectName}\n`;
    content += `Generated on: ${timestamp}\n\n`;

    for (const file of files) {
        const filePath = path.join(baseDir, file);
        const fileContent = await fs.promises.readFile(filePath, 'utf8');
        const fileExtension = path.extname(file);
        const language = fileTypeMapping[fileExtension] || 'plaintext';

        content += `## ${file}\n\n`;
        content += '```' + language + '\n';
        content += fileContent + '\n';
        content += '```\n\n';
    }

    return content;
}