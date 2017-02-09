/// <reference path="typings/globals/node/index.d.ts" />
"use strict"

import tl = require('vsts-task-lib/task');
import { KubectlCommand } from './kubectl.js';

let yamlfile: string = tl.getInput('yamlfile');
tl.debug("yamlfile --: " + yamlfile);
tl.checkPath(yamlfile, 'yamlfile');
let kubectl: KubectlCommand = new KubectlCommand();
kubectl.init().then(
    function() {
        kubectl.append('apply');
        kubectl.append('-f');
        kubectl.append(yamlfile);
        kubectl.exec();
    }
);
