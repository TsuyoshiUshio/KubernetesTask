/// <reference path="../typings/globals/node/index.d.ts" />

import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');


let taskPath = path.join(__dirname, '..', 'downloader.js');
let tr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tr.setInput('kubectlBinary', process.cwd());
tr.setInput('k8sService', 'k8sendpoint');
tr.setInput('hasIstio', 'true');
tr.setInput('IstioVersion', "0.1.6");
tr.setInput('hasHelm', 'true');
tr.setInput('helmVersion', '2.4.2')

process.env['SYSTEM_DEFAULTWORKINGDIRECTORY'] = '/opt/vsts/work/r1/a'
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
        "bash":  "/bin/bash"
    },
    "checkPath": {
        "./Tests/my-nginx.yml": true,
        "/opt/vsts/work/r1/a/.vstsbin/kubectl.vSomeVersion": true,
        "./kubeconfig": true,
        "/bin/bash": true,
    },
    "cwd": {
        "cwd": process.cwd(),
    },
    "osType": {
        "osType": "Linux",
    },
    "exec": {
        "curl -L https://storage.googleapis.com/kubernetes-release/release/stable.txt": {
          "code": 0,
          "stdout": "vSomeVersion"  
       },
        "curl -L -o /opt/vsts/work/r1/a/.vstsbin/kubectl.vSomeVersion https://storage.googleapis.com/kubernetes-release/release/vSomeVersion/bin/linux/amd64/kubectl": {
          "code": 0,
          "stdout": ""  
       },
        "chmod 777 /opt/vsts/work/r1/a/.vstsbin/kubectl.vSomeVersion": {
          "code": 0,
          "stdout": ""  
       },
        "cp /opt/vsts/work/r1/a/.vstsbin/kubectl.vSomeVersion /opt/vsts/work/r1/a/.vstsbin/kubectl": {
          "code": 0,
          "stdiout": ""
       },
       "mkdir -p /opt/vsts/work/r1/a/.vstsbin": {
          "code": 0,
          "stdiout": ""
        },
        "/bin/bash .istioctldownloader.sh": {
            "code": 0,
            "stdiout": ""
        },
        "/bin/bash .helmdownloader.sh": {
            "code": 0,
            "stdiout": ""
        }
    }
}

tr.setAnswers(a);

tr.run();