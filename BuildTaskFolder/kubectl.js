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
const toolrunner_1 = require("vsts-task-lib/toolrunner");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var echo = new toolrunner_1.ToolRunner(tl.which('echo', true));
            var endpoint = tl.getInput('k8sService');
            var kubeconfig = tl.getEndpointAuthorizationParameter(endpoint, 'kubeconfig', true);
            var yamlfile = tl.getInput('yamlfile');
            tl.checkPath(yamlfile, 'yamlfile');
            var kubectlbinary = tl.getInput('kubectlBinary');
            tl.checkPath(kubectlbinary, 'kubectlBinary');
            var configfile = path.join(tl.cwd() + "config");
            yield fs.writeFile(configfile, kubeconfig, (err) => {
                if (err)
                    throw err;
                tl.debug('It\'s saved!');
            });
            tl.debug("DEBUG:  " + kubectlbinary + " apply -f " + yamlfile + " --kubeconfig config");
            var kubectl = tl.tool(kubectlbinary + ' apply -f ' + yamlfile + ' --kubeconfig config');
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
