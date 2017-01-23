/// <reference path="../typings/globals/node/index.d.ts" />

import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'kubectl.js');
let tr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tr.setInput('yamlfile', '/path/to/some.yml');
tr.setInput('kubectlBinary', '/path/to/kubectl');
tr.setInput('k8sService', 'k8sendpoint');

process.env['ENDPOINT_AUTH_K8SENDPOINT_KUBECONFIG'] = `

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
   "exec": {
       "/path/to/kubectl apply -f /path/to/some.yml": {
          "code": 0,
          "stdout": "deployment \"nginx-deployment\" created"  
       }
   } 
}