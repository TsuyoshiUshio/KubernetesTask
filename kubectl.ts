/// <reference path="typings/globals/node/index.d.ts" />
"use strict"

import tl = require('vsts-task-lib/task');
import path = require('path');

import fs = require('fs');
import { ToolRunner } from 'vsts-task-lib/toolrunner';

export class KubectlCommand {
    endpoint: string;
    kubeconfig: string;
    kubectlbinary: string;
    configfile: string;
    kubectl: ToolRunner;

    isBase64(contents) {
    let base64Regx = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/
    return base64Regx.test(contents);
    }

    decodeBase64(contents) {
        return new Buffer(contents, 'base64').toString();
    }

    constructor() {
        this.endpoint = tl.getInput('k8sService');
        this.kubeconfig = tl.getEndpointAuthorizationParameter(this.endpoint, 'kubeconfig', true);
        if (this.isBase64(this.kubeconfig)) {
            this.kubeconfig = this.decodeBase64(this.kubeconfig);
        }   
        this.kubectlbinary = tl.getInput('kubectlBinary');
        this.configfile = path.join(tl.cwd(), "config");
        this.kubectl = tl.tool(this.kubectlbinary);
    }
    append(arg) {
        this.kubectl.arg(arg);
    }
    exec() {
        this.execCommand();
    }
    async execCommand() {
        try {                     
             tl.debug("cwd(): " + tl.cwd());
             tl.debug("configfile: " + this.configfile);
             await fs.writeFile(this.configfile, this.kubeconfig);
             this.kubectl.arg('--kubeconfig').arg(this.configfile);

            let ls: ToolRunner = tl.tool("ls");
            ls.arg("-l");
            await ls.exec();

             tl.debug("settings kubectl exec perms");
             tl.checkPath(this.kubectlbinary, 'kubectlBinary');
             tl.checkPath(this.configfile, 'configFile');
             await this.kubectl.exec();

             tl.setResult(tl.TaskResult.Succeeded, "kubectl works.");
             return;
        } catch (err) {
            tl.setResult(tl.TaskResult.Failed, err);
        }
    }
}
