/// <reference path="../typings/globals/chai/index.d.ts" />
/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/node/index.d.ts" />


import * as path from 'path';
import * as ttm from 'vsts-task-lib/mock-test';
import * as tl from 'vsts-task-lib/task';

let expect = require('chai').expect;
let fs = require('fs');

let config_file_path = "./kubeconfig";

function isExistFile(file) {
    try {
        fs.statSync(file);
        return true;
    } catch (err) {
        if (err.code == 'ENOENT') return false;
    }
}

describe('General Task', function () {
    before(() => {

        fs.unlink(config_file_path, function (err) {
            if (err) tl.debug("config not found (It's OK.)");
        });
    });

    after(() => {

    });

    it("exec command with kubectl download", (done:MochaDone) => {
        let tp = path.join(__dirname, 'test-general-download.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();
        tl.debug(tr.cmdlines);
        expect(tr.ran("/usr/bin/kubectl.vSomeVersion get nodes --kubeconfig ./kubeconfig")).to.be.true;
        done();
    });

    it("configure kubectl", (done: MochaDone) => {
        let tp = path.join(__dirname, 'test-general.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();
        expect(tr.succeeded).to.equal(true);
        expect(isExistFile(config_file_path)).to.be.true;
        done();
    });

    it("exec command without options", (done: MochaDone) => {
        let tp = path.join(__dirname, 'test-general.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();
        tl.debug(tr.cmdlines);
        expect(tr.ran("./Tests/kubectl get nodes --kubeconfig ./kubeconfig")).to.be.true;
        done();
    });

    it("exec command with options", (done:MochaDone) => {
        let tp = path.join(__dirname, 'test-general-expose.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();
        tl.debug(tr.cmdlines);
        expect(tr.ran("./Tests/kubectl expose deployment echoheaders --port=80 --target-port=8080 --name=echoheaders-x --kubeconfig ./kubeconfig")).to.be.true;
        done();
    });

    it("make sure the file is written collectly", (done: MochaDone) => {
        let tp = path.join(__dirname, 'test-general-base64.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();
        let contents: string = fs.readFileSync(config_file_path, 'utf8');
        let result : string = 
`
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
        expect(contents).to.equal(result);
        done();
    });
});
