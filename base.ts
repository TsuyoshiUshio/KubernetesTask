/// <reference path="typings/globals/node/index.d.ts" />
"use strict"

import * as Q from 'q';
import * as tl from 'vsts-task-lib/task';

import { ToolRunner } from 'vsts-task-lib/toolrunner';

export class BaseCommand {
    subCommand : string;
    multilineArgs : string;
    binary: string;

    constructor(binary: string) {
        this.subCommand = tl.getInput('subCommand');
        this.multilineArgs = tl.getInput('arguments');
        this.binary = binary;
    }

    checkOSType() {
        let isWin = tl.osType().match(/^Win/);
        if (isWin) {
            tl.setResult(tl.TaskResult.Failed, "This task does not work for Windows agent")
            throw "This task does not work for Windows agent."
        }
    }

    exec() {
        this.checkOSType();
        this.execCommand();
    }
    async execCommand()  {
            let binarycmd = tl.which(this.binary, true);
            let binary = tl.tool(binarycmd);
            binary.arg(this.subCommand);
            if (this.multilineArgs) {
                this.multilineArgs.split(/\s+/).map(function (x) { binary.arg(x) });
            }
    
            try {
                let result = binary.execSync();
                if (result.code != 0) {
                    throw result.error;
                }
                tl.setResult(tl.TaskResult.Succeeded, `${this.binary} command success.`);
            } catch (err) {
                tl.setResult(tl.TaskResult.Failed, err);
                throw `Failed to execute ${this.binary} command.`;
            }
    }
}



