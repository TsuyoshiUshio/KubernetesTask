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
    }
    append(arg) {
        this.kubectl.arg(arg);
    }
    exec() {
        this.execCommand();
    }
    async init() {
        if (!fs.exists(this.kubectlbinary)) {                
            tl.debug("downloading kubectl");
            let curl: ToolRunner = tl.tool("curl");
            curl.arg("-LO").arg("https://storage.googleapis.com/kubernetes-release/release/v1.5.2/bin/linux/amd64/kubectl");
            await curl.exec();
            
            tl.debug("settings kubectl exec perms");
            let sudo: ToolRunner = tl.tool("chmod");
            sudo.arg("777").arg("kubectl");
            await sudo.exec();

            this.kubectlbinary = "./kubectl";
        }

        this.kubectl = tl.tool(this.kubectlbinary);
    }
    async execCommand() {
        try {                     
             tl.checkPath(this.kubectlbinary, 'kubectlBinary');
             tl.debug("cwd(): " + tl.cwd());
             tl.debug("configfile: " + this.configfile);
             await fs.writeFile(this.configfile, this.kubeconfig);
             this.kubectl.arg('--kubeconfig').arg(this.configfile);

             tl.debug("settings kubectl exec perms");
             await this.kubectl.exec();

             tl.setResult(tl.TaskResult.Succeeded, "kubectl works.");
             return;
        } catch (err) {
            tl.setResult(tl.TaskResult.Failed, err);
        }
    }
}