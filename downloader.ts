/// <reference path="typings/globals/node/index.d.ts" />
"use strict"

import tl = require('vsts-task-lib/task');
import path = require('path');
import { KubectlCommand } from './kubectl.js';
import fs = require('fs');
import { ToolRunner } from 'vsts-task-lib/toolrunner';
let subCommand: string = tl.getInput('hasIstio');

let kubectl: KubectlCommand = new KubectlCommand();

function downloadIstioctl()  {
        let istioBinaryDir = process.env['SYSTEM_DEFAULTWORKINGDIRECTORY'];
        let bash = new ToolRunner(tl.which('bash', true));
        let downloader ="curl -L https://git.io/getIstio | sh -" + "\n" + "cp **/*/istioctl " + istioBinaryDir;
        let fileName = "./.istiodownloader.sh";
        fs.writeFileSync(fileName, downloader);
        bash.arg(fileName);
        try {
            bash.execSync();
        } catch(err) {
            tl.setResult(tl.TaskResult.Failed, err);
            throw "Failed to exec the .istiodownloader.sh which is istio downloader."
        }
 
        tl.setVariable("PATH", istioBinaryDir + '/istioctl:' + tl.getVariable("PATH"));
        
}

kubectl.init().then(
    function() {
        downloadIstioctl();
    }
);