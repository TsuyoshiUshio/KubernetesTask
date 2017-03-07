/// <reference path="../typings/globals/node/index.d.ts" />

import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'general.js');
let tr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tr.setInput('kubectlBinary', './Tests/kubectl');
tr.setInput('k8sService', 'k8sendpoint');
tr.setInput('subCommand', 'expose');
tr.setInput('arguments', 'deployment echoheaders\n--port=80\n--target-port=8080\n--name=echoheaders-x');


process.env['ENDPOINT_AUTH_PARAMETER_K8SENDPOINT_KUBECONFIG'] = `Ci0tLQphcGlWZXJzaW9uOiB2MQpjbHVzdGVyczoKLSBjbHVzdGVyOgogICAgY2VydGlmaWNhdGUtYXV0aG9yaXR5LWRhdGE6ICJYWFhYWFhYWFhYWFhYWFhYIgogICAgc2VydmVyOiBodHRwczovL3h4eHh4eHh4bWdtdC5qYXBhbndlc3QuY2xvdWRhcHAuYXp1cmUuY29tCiAgbmFtZTogInh4eHh4eHh4bWdtdCIKY29udGV4dHM6Ci0gY29udGV4dDoKICAgIGNsdXN0ZXI6ICJ4eHh4eHh4eG1nbXQiCiAgICB1c2VyOiAieHh4eHh4eHhtZ210LWFkbWluIgogIG5hbWU6ICJ4eHh4eHh4eG1nbXQiCmN1cnJlbnQtY29udGV4dDogInh4eHh4eHh4bWdtdCIKa2luZDogQ29uZmlnCnVzZXJzOgotIG5hbWU6ICJ4eHh4eHh4eG1nbXQtYWRtaW4iCiAgdXNlcjoKICAgIGNsaWVudC1jZXJ0aWZpY2F0ZS1kYXRhOiAiWFhYWFhYWFhYWCIKICAgIGNsaWVudC1rZXktZGF0YTogIlhYWFhYWFhYWFhYWFhYWFhYWCIKCg==`;

let a: ma.TaskLibAnswers = <ma.TaskLibAnswers> {
    "checkPath": {
        "./Tests/kubectl": true,
        "./kubeconfig": true
    },
    "cwd": {
        "cwd": process.cwd(),
    },
    "exec": {
       "./Tests/kubectl expose deployment echoheaders --port=80 --target-port=8080 --name=echoheaders-x --kubeconfig ./config": {
          "code": 0,
          "stdout": "echoheader exposed."  
       }
   } 
}
tr.setAnswers(a);

tr.run();