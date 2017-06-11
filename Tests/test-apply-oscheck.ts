/// <reference path="../typings/globals/node/index.d.ts" />

import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'apply.js');
let tr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tr.setInput('yamlfile', './Tests/my-nginx.yml');
tr.setInput('kubectlBinary', './Tests/kubectl');
tr.setInput('k8sService', 'k8sendpoint');
tr.setInput('system.debug', 'true');

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
    "which": {
        "echo":  "/usr/bin/echo"
    },
    "checkPath": {
        "./Tests/my-nginx.yml": true,
        "./Tests/kubectl": true,
        "./kubeconfig": true
    },
    "cwd": {
        "cwd": process.cwd(),
    },
    "osType": {
        "osType": "Windows_NT",
    },
    "exec": {
       "./Tests/kubectl apply -f ./Tests/my-nginx.yml --kubeconfig ./kubeconfig": {
          "code": 0,
          "stdout": "deployment \"nginx-deployment\" created"  
       }
   } 
}
tr.setAnswers(a);

tr.run();