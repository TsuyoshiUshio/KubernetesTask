/// <reference path="typings/globals/node/index.d.ts" />
"use strict"

import tl = require('vsts-task-lib/task');
import path = require('path');
import { KubectlCommand } from './kubectl.js';
import fs = require('fs');
import { ToolRunner } from 'vsts-task-lib/toolrunner';
let hasIstio: boolean = (tl.getInput('hasIstio') == 'true');
let istioVersion: string = tl.getInput('IstioVersion');

let kubectl: KubectlCommand = new KubectlCommand();

function downloadIstioctl()  {
        let istioBinaryDir = process.env['SYSTEM_DEFAULTWORKINGDIRECTORY'] + "/.vstsbin";
        let bash = new ToolRunner(tl.which('bash', true));
        let downloadURL = `https://github.com/istio/istio/releases/download/${istioVersion}/istio-${istioVersion}-linux.tar.gz`;

        let downloader = "curl -L " + downloadURL + " | tar xz" + "\n" + "cp **/*/istioctl " + istioBinaryDir;
        let fileName = "./.istiodownloader.sh";
        fs.writeFileSync(fileName, downloader);
        bash.arg(fileName);
        try {
            bash.execSync();
        } catch(err) {
            tl.setResult(tl.TaskResult.Failed, err);
            throw "Failed to exec the .istiodownloader.sh which is istio downloader."
        }
       
}

kubectl.init().then(
    function() {
        if (hasIstio) {
            downloadIstioctl();
        }
    }
);