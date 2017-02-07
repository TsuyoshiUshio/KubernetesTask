/// <reference path="typings/globals/node/index.d.ts" />
"use strict"

import tl = require('vsts-task-lib/task');
import path = require('path');

import fs = require('fs');
import { ToolRunner } from 'vsts-task-lib/toolrunner';

async function run() {
    try {

        let endpoint: string = tl.getInput('k8sService');
        let kubeconfig: string = tl.getEndpointAuthorizationParameter(endpoint, 'kubeconfig', true);

        let kubectlbinary: string = tl.getInput('kubectlBinary');
        tl.checkPath(kubectlbinary, 'kubectlBinary');

        let configfile: string = path.join(tl.cwd(), "config");
        tl.debug("cwd(): " + tl.cwd());
        tl.debug("configfile: " + configfile);
        await fs.writeFile(configfile, kubeconfig);

        let subCommand: string = tl.getInput('subCommand');

        let multilineArgs: string = tl.getInput('arguments');

        let kubectl: ToolRunner = tl.tool(kubectlbinary).arg(subCommand);
        multilineArgs.split(/\s+/).map(function(x) {kubectl.arg(x)} );
        kubectl.arg('--kubeconfig').arg('./config');

        await kubectl.exec();

        tl.setResult(tl.TaskResult.Succeeded, "kubectl works.");
        return;

    } catch (err) {
        tl.setResult(tl.TaskResult.Failed, err);
    }
}

run();


