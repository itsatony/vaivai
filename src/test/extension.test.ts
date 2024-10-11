import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { loadConfig, getProjectName, VaivaiConfig } from '../config';
import { generateFileList } from '../fileListGenerator';
import { generateContentOverview } from '../contentOverviewGenerator';
import { suite, test } from 'mocha';

suite('Vaivai Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Configuration Loading', async () => {
        const config = await loadConfig();
        assert.ok(config, 'Configuration should be loaded');
        if (config) {
            assert.ok(config.file_list, 'Configuration should have file_list section');
            assert.ok(config.content_overview, 'Configuration should have content_overview section');
        }
    });

    test('Project Name Detection', async () => {
        const projectName = await getProjectName('');
        assert.ok(projectName, 'Project name should be detected');
        assert.notStrictEqual(projectName, 'Unknown Project', 'Project name should not be "Unknown Project"');
    });

    test('File List Generation', async () => {
        const config = await loadConfig();
        assert.ok(config, 'Configuration should be loaded');
        if (config && vscode.workspace.workspaceFolders) {
            const projectName = await getProjectName('');
            await generateFileList(config, projectName);

            const outputPath = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, config.file_list.output_file);
            assert.ok(fs.existsSync(outputPath), 'File list should be generated');

            const content = fs.readFileSync(outputPath, 'utf8');
            assert.ok(content.includes(projectName), 'Generated file should include project name');
        } else {
            assert.fail('Config or workspace folders are not available');
        }
    });

    test('Content Overview Generation', async () => {
        const config = await loadConfig();
        assert.ok(config, 'Configuration should be loaded');
        if (config && vscode.workspace.workspaceFolders) {
            const projectName = await getProjectName('');
            await generateContentOverview(config, projectName);

            const outputPath = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, config.content_overview.output_file);
            assert.ok(fs.existsSync(outputPath), 'Content overview should be generated');

            const content = fs.readFileSync(outputPath, 'utf8');
            assert.ok(content.includes(projectName), 'Generated file should include project name');
            assert.ok(content.includes('```'), 'Generated file should include code blocks');
        } else {
            assert.fail('Config or workspace folders are not available');
        }
    });
});