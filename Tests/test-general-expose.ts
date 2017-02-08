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


process.env['ENDPOINT_AUTH_PARAMETER_K8SENDPOINT_KUBECONFIG'] = `

---
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: "XXXXXXXXXXXXXXXX"
    server: https://xxxxxxxxmgmt.japanwest.cloudapp.azure.com
  name: "xxxxxxxxmgmt"
contexts:
- context:
    cluster: "xxxxxxxxmgmt"
    user: "xxxxxxxxmgmt-admin"
  name: "xxxxxxxxmgmt"
current-context: "xxxxxxxxmgmt"
kind: Config
users:
- name: "xxxxxxxxmgmt-admin"
  user:
    client-certificate-data: "XXXXXXXXXX"
    client-key-data: "XXXXXXXXXXXXXXXXXX"


`;

let a: ma.TaskLibAnswers = <ma.TaskLibAnswers> {
    "checkPath": {
        "./Tests/kubectl": true
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