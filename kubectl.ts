/// <reference path="typings/globals/node/index.d.ts" />
"use strict"

import Q = require('q');
import tl = require('vsts-task-lib/task');
import path = require('path');

import fs = require('fs');
import { ToolRunner } from 'vsts-task-lib/toolrunner';

export class KubectlCommand {
    endpoint: string;
    kubeconfig: string;
    kubectlbinary: string;
    downloadVersion: string;
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
        this.configfile = './kubeconfig';
    }
    append(arg) {
        this.kubectl.arg(arg);
    }
    exec() {
        this.execCommand();
    }
    async init() {
        if (!this.kubectlbinary) {
            this.kubectlbinary = await this.downloadKubectl(this.downloadVersion);
        }

        this.kubectl = tl.tool(this.kubectlbinary);
    }

    async downloadKubectl(downloadVersion: string) : Q.Promise<string> {
        
        if (!downloadVersion)
        {
            tl.debug("getting kubectl current stable version");
            let curl: ToolRunner = tl.tool("curl");
            curl.arg("-LO").arg("https://storage.googleapis.com/kubernetes-release/release/stable.txt");
            var result = curl.execSync();
            downloadVersion = result.stdout.toString().trim();
        }

        var kubectlBinary = `/usr/bin/kubectl.${downloadVersion}`;
        if (!fs.exists(kubectlBinary)) {
            tl.debug(`downloading kubectl [${kubectlBinary}]`);
            let curl: ToolRunner = tl.tool("curl");
            curl.arg("-L").arg("-o").arg(kubectlBinary).arg(`https://storage.googleapis.com/kubernetes-release/release/${downloadVersion}/bin/linux/amd64/kubectl`);
            await curl.exec();
            
            tl.debug("settings kubectl exec perms");
            let chmod: ToolRunner = tl.tool("chmod");
            chmod.arg("777").arg("kubectl");
            await chmod.exec();            
        }

        tl.debug(`using [${kubectlBinary}]`);
        return kubectlBinary;
    }

    async execCommand() {
        try {                     
             tl.debug("cwd(): " + tl.cwd());
             tl.debug("configfile: " + this.configfile);
             await fs.writeFile(this.configfile, this.kubeconfig);
             this.kubectl.arg('--kubeconfig').arg(this.configfile);

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