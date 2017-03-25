/// <reference path="../typings/globals/node/index.d.ts" />

import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'general.js');
let tr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tr.setInput('kubectlBinary', process.cwd());
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
        "/usr/bin/kubectl.vSomeVersion": true,
        "./kubeconfig": true
    },
    "cwd": {
        "cwd": process.cwd(),
    },
    "exec": {
       "/usr/bin/kubectl.vSomeVersion get nodes --kubeconfig ./kubeconfig": {
          "code": 0,
          "stdout": "NAME                    STATUS                     AGE\nk8s-agent-559ac24b-0    Ready                      28d\nk8s-master-559ac24b-0   Ready,SchedulingDisabled   28d"  
       },
        "curl -L https://storage.googleapis.com/kubernetes-release/release/stable.txt": {
          "code": 0,
          "stdout": "vSomeVersion"  
       },
        "curl -L -o /usr/bin/kubectl.vSomeVersion https://storage.googleapis.com/kubernetes-release/release/vSomeVersion/bin/linux/amd64/kubectl": {
          "code": 0,
          "stdout": ""  
       },
        "chmod 777 /usr/bin/kubectl.vSomeVersion": {
          "code": 0,
          "stdout": ""  
       }
    } 
}
tr.setAnswers(a);

tr.run();