/// <reference path="typings/globals/node/index.d.ts" />
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const tl = require("vsts-task-lib");
const path = require("path");
const fs = require("fs");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let endpoint = tl.getInput('k8sService');
            let kubeconfig = tl.getEndpointAuthorizationParameter(endpoint, 'kubeconfig', true);
            let yamlfile = tl.getInput('yamlfile');
            tl.checkPath(yamlfile, 'yamlfile');
            let kubectlbinary = tl.getInput('kubectlBinary');
            tl.checkPath(kubectlbinary, 'kubectlBinary');
            let configfile = path.join(tl.cwd(), "config");
            tl.debug("cwd(): " + tl.cwd());
            tl.debug("configfile: " + configfile);
            fs.writeFileSync(configfile, kubeconfig);
            tl.debug("DEBUG:  " + kubectlbinary + " apply -f " + yamlfile + " --kubeconfig ./config");
            let kubectl = tl.tool(kubectlbinary).arg('apply').arg('-f').arg(yamlfile).arg('--kubeconfig').arg('./config');
            let result = kubectl.execSync();
            tl.debug("STDOUT: " + result.stdout);
            tl.debug("STDERR: " + result.stdout);
            tl.setResult(tl.TaskResult.Succeeded, "kubectl works.");
            return;
        }
        catch (err) {
            tl.setResult(tl.TaskResult.Failed, err);
        }
    });
}
run();
