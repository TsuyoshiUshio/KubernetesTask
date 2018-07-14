/// <reference path="typings/globals/node/index.d.ts" />
"use strict"

import tl = require('vsts-task-lib/task');
import path = require('path');
import { KubectlCommand } from './kubectl.js';
import fs = require('fs');
import { ToolRunner } from 'vsts-task-lib/toolrunner';
let hasIstio: boolean = (tl.getInput('hasIstio') == 'true');
let istioVersion: string = tl.getInput('IstioVersion');
let hasHelm: boolean = (tl.getInput('hasHelm') == 'true');
let helmVersion: string = tl.getInput('helmVersion');

let kubectl: KubectlCommand = new KubectlCommand();

function downloadIstioctl()  {
        downloader(`https://github.com/istio/istio/releases/download/${istioVersion}/istio-${istioVersion}-linux.tar.gz`,
                    "istioctl",
                    "**/*/istioctl");
}

function downloadHelm() {
        downloader(`https://storage.googleapis.com/kubernetes-helm/helm-v${helmVersion}-linux-amd64.tar.gz`,
                    "helm",
                    "./linux-amd64/helm");
}

async function downloader(downloadURL:string, binaryName:string, copyTarget:string)  {
        let binaryDir = process.env['SYSTEM_DEFAULTWORKINGDIRECTORY'] + "/.vstsbin";
        let bashcmd = tl.which('bash', true);
        let bash = tl.tool(bashcmd);
        let downloader = "curl -L " + downloadURL + " | tar xz" + "\n" + "cp " + copyTarget + " " + binaryDir;
        let fileName = path.join('.', `.${binaryName}downloader.sh`);
        try {
            fs.writeFileSync(fileName, downloader);
        } catch(err) {
            tl.setResult(tl.TaskResult.Failed, err);
            throw `Failed to create the ${fileName}.`
        }
        bash.arg(fileName);
        try {
            let result = bash.execSync();
            if (result.code != 0) {
               throw result.error;
            }
            tl.setResult(tl.TaskResult.Succeeded, "bash executed");
            return;
        } catch(err) {
            tl.setResult(tl.TaskResult.Failed, err);
            throw `Failed to exec the .${binaryName}downloader.sh which is ${binaryName} downloader.`;
        }
}

kubectl.init().then(
    function() {
        if (hasIstio) {
            downloadIstioctl();
        }
        if (hasHelm) {
            downloadHelm();
        }
    }
);