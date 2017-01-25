"use strict";
/// <reference path="typings/globals/node/index.d.ts" />
var tl = require("vsts-task-lib");
var path = require("path");
var fs = require("fs");
var toolrunner_1 = require("vsts-task-lib/toolrunner");
var echo = new toolrunner_1.ToolRunner(tl.which('echo', true));
var endpoint = tl.getInput('k8sService');
var kubeconfig = tl.getEndpointAuthorizationParameter(endpoint, 'kubeconfig', true);
var yamlfile = tl.getInput('yamlfile');
tl.checkPath(yamlfile, 'yamlfile');
var kubectlbinary = tl.getInput('kubectlBinary');
tl.checkPath(kubectlbinary, 'kubectlBinary');
var configfile = path.join(tl.cwd() + "config");
tl.debug("DEBUG:  " + kubectlbinary + " apply -f " + yamlfile + " --kubeconfig config");
var kubectl = tl.tool(kubectlbinary + ' apply -f ' + yamlfile + ' --kubeconfig config');
kubectl.exec();
fs.writeFile(configfile, kubeconfig, function (err) {
    if (err)
        throw err;
    tl.debug('It\'s saved!');
});
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
