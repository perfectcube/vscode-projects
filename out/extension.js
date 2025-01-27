"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const taskProvider_1 = require("./taskProvider");
const teamworkProjects_1 = require("./teamworkProjects");
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const twp = new teamworkProjects_1.TeamworkProjects(context, context.extensionPath);
        const taskProvider = new taskProvider_1.TaskProvider(context, twp);
        vscode.window.registerTreeDataProvider('taskOutline', taskProvider);
        // Register Url Handler for App
        vscode.window.registerUriHandler({
            handleUri(uri) {
                if (uri.toString().indexOf("VSCODE") > 0) {
                    vscode.window.showInformationMessage("Teamwork: finishing login, please wait a second");
                    let code = uri.query.toString().replace("code=", "").replace("state=VSCODE", "");
                    let account = twp.FinishLogin(context, code);
                }
                else {
                    // Not yet implemented
                }
            }
        });
        // Refresh Data on startup and setup status bar
        twp.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 0);
        twp.Config = yield twp.GetProjectForRepository();
        if (twp.Config !== undefined) {
            twp.statusBarItem.command = "twp.SetActiveProject";
            twp.statusBarItem.show();
            twp.statusBarItem.text = twp.Config.ActiveProjectName;
            twp.statusBarItem.tooltip = "Click to refresh Project Data";
            setTimeout(() => twp.RefreshData(), 1 * 60 * 1000);
        }
        vscode.commands.registerCommand('taskOutline.refresh', task => {
            twp.RefreshData();
            taskProvider.refresh();
        });
        vscode.commands.registerCommand('taskOutline.showElement', task => {
            twp.openResource(task);
        });
        vscode.commands.registerCommand('twp.completeTask', (task) => {
            twp.CompleteTask(task.id);
            task.isComplete = true;
            taskProvider.refresh(task);
            vscode.window.showInformationMessage("Task completed");
        });
        vscode.commands.registerCommand('twp.SetActiveProject', task => { twp.SelectActiveProject(); });
        vscode.commands.registerCommand('twp.SetProject', task => { twp.SelectProject(); });
        vscode.commands.registerCommand('twp.RefreshData', task => { twp.RefreshData(); });
        vscode.commands.registerCommand('twp.linkTask', task => { twp.QuickAddTask(); });
        vscode.commands.registerCommand('twp.SetAccount', task => { twp.SelectAccount(); });
        // Refresh data once every 30 minutes
        setInterval(twp.RefreshData, 30 * 60 * 1000);
    });
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map