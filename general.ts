/// <reference path="typings/globals/node/index.d.ts" />
"use strict"

import tl = require('vsts-task-lib/task');
import path = require('path');
import { KubectlCommand } from './kubectl.js';

let subCommand: string = tl.getInput('subCommand');

let multilineArgs: string = tl.getInput('arguments');

let kubectl: KubectlCommand = new KubectlCommand();

kubectl.init().then(
    function() {
        kubectl.append(subCommand);

        if (multilineArgs) {
            multilineArgs.split(/\s+/).map(function (x) { kubectl.append(x) });
        }
        
        kubectl.exec();
    }
);