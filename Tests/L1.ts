/// <reference path="../typings/globals/chai/index.d.ts" />
/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/node/index.d.ts" />


import * as path from 'path';
import * as ttm from 'vsts-task-lib/mock-test';
import * as tl from 'vsts-task-lib/task';


let expect = require('chai').expect;
let fs = require('fs');

let parent_dir = path.normalize(path.join(__dirname, '..'));
tl.debug("parent_dir: " + parent_dir);
let config_file_path = path.join(parent_dir, "config");

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
        expect(tr.ran("./Tests/kubectl get nodes --kubeconfig ./config")).to.be.true;
        done();
    });

    it("exec command with options", (done:MochaDone) => {
        let tp = path.join(__dirname, 'test-general-expose.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();
        tl.debug(tr.cmdlines);
        expect(tr.ran("./Tests/kubectl expose deployment echoheaders --port=80 --target-port=8080 --name=echoheaders-x --kubeconfig ./config")).to.be.true;
        done();
    });
});
