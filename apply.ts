/// <reference path="typings/globals/node/index.d.ts" />
"use strict"

import tl = require('vsts-task-lib');
import path = require('path');

import fs = require('fs');
import { ToolRunner } from 'vsts-task-lib/toolrunner';

async function run() {
    try {

        let endpoint: string = tl.getInput('k8sService');
        let kubeconfig: string = tl.getEndpointAuthorizationParameter(endpoint, 'kubeconfig', true);

        let yamlfile: string = tl.getInput('yamlfile');
        tl.checkPath(yamlfile, 'yamlfile');


        let kubectlbinary: string = tl.getInput('kubectlBinary');
        
        tl.checkPath(kubectlbinary, 'kubectlBinary');
        let configfile: string = path.join(tl.cwd(), "config");
        tl.debug("cwd(): " + tl.cwd());
        tl.debug("configfile: " + configfile);
        await fs.writeFile(configfile, kubeconfig);
        
        tl.debug("DEBUG:  " + kubectlbinary + " apply -f " + yamlfile + " --kubeconfig ./config")

        let kubectl: ToolRunner = tl.tool(kubectlbinary).arg('apply').arg('-f').arg(yamlfile).arg('--kubeconfig').arg('./config');
        tl.debug("BBBB1");
        kubectl.exec();

        tl.setResult(tl.TaskResult.Succeeded, "kubectl works.")
        return;

    } catch (err) {
        tl.setResult(tl.TaskResult.Failed, err);
    }
}

run();


