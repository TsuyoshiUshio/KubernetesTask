/// <reference path="../typings/globals/node/index.d.ts" />

import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'general.js');
let tr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tr.setInput('kubectlBinary', './Tests/kubectl');
tr.setInput('k8sService', 'k8sendpoint');
tr.setInput('subCommand', 'get');
tr.setInput('arguments', 'nodes');

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
        "./Tests/my-nginx.yml": true,
        "./Tests/kubectl": true,
        "./kubeconfig": true
    },
    "cwd": {
        "cwd": process.cwd(),
    },
    "exec": {
       "./Tests/kubectl get nodes --kubeconfig ./kubeconfig": {
          "code": 0,
          "stdout": "NAME                    STATUS                     AGE\nk8s-agent-559ac24b-0    Ready                      28d\nk8s-master-559ac24b-0   Ready,SchedulingDisabled   28d"  
       }
   } 
}
tr.setAnswers(a);

tr.run();