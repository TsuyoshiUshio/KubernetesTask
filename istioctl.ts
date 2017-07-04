/// <reference path="typings/globals/node/index.d.ts" />
"use strict"

import * as Q from 'q';
import * as tl from 'vsts-task-lib/task';

import { ToolRunner } from 'vsts-task-lib/toolrunner';
import { BaseCommand } from './base.js';


let command = new BaseCommand('istioctl');
command.exec();

