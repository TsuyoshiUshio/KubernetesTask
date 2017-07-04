/// <reference path="../typings/globals/node/index.d.ts" />

import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'istioctl.js');
let tr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tr.setInput('subCommand', 'version');
tr.setInput('arguments', "--managerAPIService=peeking-ostrich-istio-manager:8081 -v 5");


let a: ma.TaskLibAnswers = <ma.TaskLibAnswers> {
    "which": {
        "istioctl": "./.vstsbin/istioctl"
    },
    "checkPath": {
        "./.vstsbin/istioctl": true
    },
    "cwd": {
        "cwd": process.cwd(),
    },
    "osType": {
        "osType": "Linux",
    },
    "exec": {
       './vstsbin/istioctl version --managerAPIService=peeking-ostrich-istio-manager:8081 -v 5': {   
          "code": 0,
          "stdout": "istioctl version:\n\nVersion: 0.1.5\n\n..."  
       }
   } 
}
tr.setAnswers(a);

tr.run();