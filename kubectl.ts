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
    configline: boolean;

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
        this.kubectl = tl.tool(this.kubectlbinary);
        this.configline = false;
        this.downloadVersion = tl.getInput('downloadVersion');
        this.configfile = './kubeconfig';

    }
    append(arg) {
        if(!this.configline && arg == "--" ) {
           this.appendKubeConfig();
            this.configline = true;
        }
        this.kubectl.arg(arg);
    }
    exec() {
        this.execCommand();
    }

    appendKubeConfig(){
         this.kubectl.arg('--kubeconfig').arg(this.configfile);
    }

    async init() {
        tl.debug("cwd(): " + tl.cwd());
        tl.debug("configfile: " + this.configfile);
        fs.writeFileSync(this.configfile, this.kubeconfig);


        if (this.kubectlbinary === tl.cwd()) {
            this.kubectlbinary = await this.downloadKubectl(this.downloadVersion);
        }

        this.kubectl = tl.tool(this.kubectlbinary);
    }

    async downloadKubectl(downloadVersion: string) : Q.Promise<string> {
        try {                     
            if (!downloadVersion) {
                tl.debug("getting kubectl current stable version");
                let curl: ToolRunner = tl.tool("curl");
                curl.arg("-L").arg("https://storage.googleapis.com/kubernetes-release/release/stable.txt");
                let result = curl.execSync();
                downloadVersion = result.stdout.toString().trim();
            }
            let kubectlBinaryDir = process.env['SYSTEM_DEFAULTWORKINGDIRECTORY'];
            let kubectlBinary = kubectlBinaryDir + `/kubectl.${downloadVersion}`;
            if (!fs.exists(kubectlBinary)) {
                tl.debug(`downloading kubectl [${kubectlBinary}]`);
                let curl: ToolRunner = tl.tool("curl");
                curl.arg("-L").arg("-o").arg(kubectlBinary).arg(`https://storage.googleapis.com/kubernetes-release/release/${downloadVersion}/bin/linux/amd64/kubectl`);
                await curl.exec();
                
                tl.debug("settings kubectl exec perms");
                let chmod: ToolRunner = tl.tool("chmod");
                chmod.arg("777").arg(kubectlBinary);
                await chmod.exec();            
            }

            tl.debug(`using [${kubectlBinary}]`);
            return kubectlBinary;
        } catch (err) {
           tl.setResult(tl.TaskResult.Failed, err);
           throw(err);
        }
    }

    async execCommand() {
        try {                   
             tl.debug("settings kubectl exec perms");
             tl.checkPath(this.kubectlbinary, 'kubectlBinary');
             tl.checkPath(this.configfile, 'configFile');
             if(!this.configline){
                this.appendKubeConfig();
                this.configline = true;
             }  
             await this.kubectl.exec();


             tl.setResult(tl.TaskResult.Succeeded, "kubectl works.");
             return;
        } catch (err) {
           tl.setResult(tl.TaskResult.Failed, err);
        }
    }
}