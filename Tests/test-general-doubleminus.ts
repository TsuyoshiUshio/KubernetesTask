/// <reference path="../typings/globals/node/index.d.ts" />

import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'general.js');
let tr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tr.setInput('kubectlBinary', './Tests/kubectl');
tr.setInput('k8sService', 'k8sendpoint');
tr.setInput('subCommand', 'exec');
tr.setInput('arguments', 'mongo-2180634381-zx0d3 --namespace mrp -- mongo ordering /tmp/MongoRecords.js');

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
        "./Tests/kubectl": true,
        "./kubeconfig": true
    },
    "cwd": {
        "cwd": process.cwd(),
    },
    "osType": {
        "osType": "Linux",
    },
    "exec": {
       "./Tests/kubectl exec mongo-2180634381-zx0d3 --namespace mrp --kubeconfig ./kubeconfig -- mongo ordering /tmp/MongoRecords.js": {
          "code": 0,
          "stdout": "OK"  
       }
   } 
}
tr.setAnswers(a);

tr.run();