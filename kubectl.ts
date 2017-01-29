/// <reference path="typings/globals/node/index.d.ts" />
"use strict"

import tl = require('vsts-task-lib');
import path = require('path');

import fs = require('fs');
import { ToolRunner } from 'vsts-task-lib/toolrunner';

async function run() {
    try {

        var echo = new ToolRunner(tl.which('echo', true));

        var endpoint: string = tl.getInput('k8sService');
        var kubeconfig: string = tl.getEndpointAuthorizationParameter(endpoint, 'kubeconfig', true);

        var yamlfile: string = tl.getInput('yamlfile');
        tl.checkPath(yamlfile, 'yamlfile');


        var kubectlbinary: string = tl.getInput('kubectlBinary');
        
        tl.checkPath(kubectlbinary, 'kubectlBinary');
        var configfile: string = path.join(tl.cwd() + "config");

        await fs.writeFile(configfile, kubeconfig, (err) => {
            if (err) throw err;
            tl.debug('It\'s saved!');
        });

        tl.debug("DEBUG:  " + kubectlbinary + " apply -f " + yamlfile + " --kubeconfig config")

        var kubectl: ToolRunner = tl.tool(kubectlbinary + ' apply -f ' + yamlfile + ' --kubeconfig config');
        let result =  kubectl.execSync();
        tl.debug("STDOUT: " + result.stdout);
        tl.debug("STDERR: " + result.stdout);

        tl.setResult(tl.TaskResult.Succeeded, "kubectl works.")
        return;

    } catch (err) {
        tl.setResult(tl.TaskResult.Failed, err);
    }
}

run();

// will error and fail task if it doesn't exist
// tl.checkPath(cwd, 'cwd');
// tl.cd(cwd);

// echo.exec({ failOnStdErr: false})
// .then(function(code) {
//    tl.debug('taskRunner success');
//    tl.exit(code);
// })
// .fail(function(err) {
//     console.error(err.message);
//    tl.debug('taskRunner fail');
//    tl.exit(1);
// })
