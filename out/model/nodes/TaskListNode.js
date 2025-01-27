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
class TaskListNode {
    constructor(label, id, parentNode, provider, twp) {
        this.label = label;
        this.id = id;
        this.parentNode = parentNode;
        this.provider = provider;
        this.twp = twp;
    }
    getTreeItem() {
        return {
            label: this.label,
            collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
            contextValue: "twp-TaskList",
        };
    }
    getChildren(context) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.twp.getTaskItems(context, this, this.provider);
            }
            catch (error) {
                vscode.window.showErrorMessage(error);
                return [];
            }
        });
    }
}
exports.TaskListNode = TaskListNode;
//# sourceMappingURL=TaskListNode.js.map