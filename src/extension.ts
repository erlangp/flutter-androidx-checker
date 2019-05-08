/**
 * Copyright 2019 ErlangParasu
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";

// Created by Erlang Parasu 2019

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as jsyaml from 'js-yaml';
import * as fs from 'fs';
// import * as G from 'glob';
import { table } from 'table';
import * as path from 'path';
var fileSep = path.sep;    // returns '\\' on windows, '/' on *nix

// This method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('onActivate');

    let mThenableProgress;
    let mIntervalId: NodeJS.Timeout;
    let mResolve: (value?: string) => void;
    let mReject: (reason?: any) => void;
    let mStrResult = '';

    // Register a content provider for the scheme
    const MY_SCHEME = 'flutterandroixchecker';
    const MY_PROVIDER = new class implements vscode.TextDocumentContentProvider {
        // Emitter and its event
        onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();

        onDidChange = this.onDidChangeEmitter.event;

        provideTextDocumentContent(uri: vscode.Uri): string {
            // Simply invoke flutterandroixchecker
            return mStrResult;
        }
    }
    context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(MY_SCHEME, MY_PROVIDER));

    context.subscriptions.push(vscode.commands.registerCommand('extension.openVirDocResult', async () => {
        let currentdate = new Date();
        let datetime = ""
            + currentdate.getFullYear() + "-"
            + (currentdate.getMonth() + 1) + "-"
            + currentdate.getDate() + "-"
            + currentdate.getHours() + "-"
            + currentdate.getMinutes() + "-"
            + currentdate.getSeconds() + "";

        let uri = vscode.Uri.parse(MY_SCHEME + ':FlutterAndroidxChecker_Result-' + datetime + '');
        let doc = await vscode.workspace.openTextDocument(uri); // Calls back into the provider
        await vscode.window.showTextDocument(doc, { preview: false });
    }));

    let disposableDependencyChecker = vscode.commands.registerTextEditorCommand('extension.checkDependencies', (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, args: any[]) => {
        // try {
        //     mReject(new Error('CancelProgress'));
        // } catch (e) {
        //     // Do nothing.
        // }

        // vscode.window.showInformationMessage('execute FlutterAndroidxChecker');

        mStrResult = ''; // Reset text first.

        if (fileSep) {
            // OK
        } else {
            return;
        }

        // console.log(vscode.workspace.rootPath);
        let yamlContent: string = '';
        try {
            yamlContent = fs.readFileSync(vscode.workspace.rootPath + '/pubspec.yaml', 'utf8')
        } catch (e) {
            return;
        }

        if (yamlContent) {
            // OK
        } else {
            return;
        }

        let flutterPubspecData = null;
        try {
            flutterPubspecData = <FlutterPubspecData>jsyaml.load(yamlContent);
        } catch (e) {
            return;
        }

        if (flutterPubspecData) {
            // OK
        } else {
            return;
        }

        if (flutterPubspecData.dependencies) {
            // OK
        } else {
            return;
        }

        let dependencies = flutterPubspecData.dependencies;
        let dependencyNames: string[] = Object.keys(dependencies);
        // console.log('dependencyNames:', dependencyNames);

        let flutterPluginContent: string = '';
        try {
            flutterPluginContent = fs.readFileSync(vscode.workspace.rootPath + '/.flutter-plugins', 'utf8');
        } catch (e) {
            return;
        }

        if (flutterPluginContent) {
            // OK
        } else {
            return;
        }

        let pluginNamesAndPaths: any = {};
        if (flutterPluginContent) {
            let lines = flutterPluginContent.split("\n");
            if (lines) {
                lines.forEach(strLine => {
                    if (strLine) {
                        // OK
                    } else {
                        return;
                    }

                    let nameAndPath = strLine.split('=');

                    let pluginName = nameAndPath[0];
                    if (pluginName) {
                        // OK
                    } else {
                        return;
                    }

                    let pluginPath = nameAndPath[1];
                    if (pluginPath) {
                        // OK
                    } else {
                        return;
                    }

                    pluginNamesAndPaths[pluginName] = pluginPath;
                });
            } else {
                return;
            }
        } else {
            return;
        }

        // let androidPackageNames: string[] = [];
        let gradleBuildFileLocations: string[] = [];
        let nameOfGradleBuildFileLocations: string[] = [];
        dependencyNames.forEach(name => {
            // let value = dependencies[name];
            // console.log('value:', value);

            nameOfGradleBuildFileLocations.push(name);

            let pluginPath = pluginNamesAndPaths[name];
            if (pluginPath) {
                // OK
            } else {
                gradleBuildFileLocations.push('');
                return;
            }
            // console.log(pluginPath);

            // try {
            //     // TODO: dynamic location
            //     let buff = fs.readFileSync('D:\\androidStudioProjects\\flutter_app_001\\build\\' + name + '\\intermediates\\res\\symbol-table-with-package\\debug\\package-aware-r.txt');
            //     let strPackage = buff.toString();
            //     if (strPackage.indexOf("\n") != -1) {
            //         let arr = strPackage.split("\n");
            //         let strPackageName = arr[0];
            //         // androidPackageNames.push(strPackageName);
            //     } else {
            //         // androidPackageNames.push(strPackage);
            //     }
            // } catch (e) {
            //     //
            // }

            try {
                // let strGlobName = '' + name + '-*';
                // let fileNames: string[] = G.sync('D:\\flutter_windows_v1.2.1-stable\\flutter\\.pub-cache\\hosted\\pub.dartlang.org\\' + strGlobName + '\\android\\build.gradle');
                // if (fileNames) {
                //     if (fileNames[0]) {
                //         gradleBuildFileLocations.push(fileNames[0]);
                //         nameOfGradleBuildFileLocations.push(name);
                //     }
                // }

                gradleBuildFileLocations.push(pluginPath + 'android' + fileSep + 'build.gradle');
            } catch (e) {
                gradleBuildFileLocations.push('');
            }
        });
        // console.log(androidPackageNames);
        // console.log(gradleBuildFileLocations);

        // let arrResult: string[] = [];
        let data: any[] = [];
        gradleBuildFileLocations.forEach((gradleFilePath: string, i: number) => {
            // let androidPackageName: string = androidPackageNames[i];
            let dartDepName: string = nameOfGradleBuildFileLocations[i];
            let depVersion = dependencies[dartDepName];
            if (typeof depVersion !== 'string') {
                depVersion = '-';
            }

            if (gradleFilePath) {
                // OK
            } else {
                data.push([
                    dartDepName,
                    depVersion,
                    '-'
                ]);

                return;
            }

            try {
                let buff = fs.readFileSync(gradleFilePath);

                let gradleContent = buff.toString();
                if (gradleContent) {
                    // OK
                } else {
                    return;
                }

                if (gradleContent.indexOf("androidx.") != -1) {
                    // androidx detected
                    // arrResult.push('- ' + dartDepName + ' [androidx]');

                    data.push([
                        dartDepName,
                        depVersion,
                        'androidx'
                    ]);
                } else if (gradleContent.indexOf("android.support") != -1) {
                    // android.support detected
                    // arrResult.push('- ' + dartDepName + ' [android.support]');

                    data.push([
                        dartDepName,
                        depVersion,
                        'android.support'
                    ]);
                } else {
                    data.push([
                        dartDepName,
                        depVersion,
                        '-'
                    ]);
                }
            } catch (e) {
                data.push([
                    dartDepName,
                    depVersion,
                    '-'
                ]);
            }
        });
        // console.log(arrResult);
        // console.log(data);

        // Show the result as virtual document
        // what = arrResult.join("\n");
        mStrResult = table(data);
        vscode.commands.executeCommand('extension.openVirDocResult');
    });

    // interface MyResult {
    //     uri: vscode.Uri;
    //     positionStart: vscode.Position;
    //     positionEnd: vscode.Position;
    // }

    interface FlutterPubspecData {
        name: string,
        description: string,
        version: string,
        environment: any,
        dependencies: any,
        dev_dependencies: any,
        flutter_test: any,
        flutter: any
    }

    //

    context.subscriptions.push(disposableDependencyChecker);
}

// This method is called when your extension is deactivated
export function deactivate() {
    console.log('onDeactivate');
}
