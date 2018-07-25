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
let config_file_path = "./kubeconfig";

function isExistFile(file) {
    try {
        fs.statSync(file);
        return true;
    } catch (err) {
        if (err.code == 'ENOENT') return false;
    }
}

describe('Kubectl apply Task', function () {
    before(() => {

        fs.unlink(config_file_path, function (err) {
            if (err) tl.debug("config not found (It's OK.)");
            tl.debug("Sucessfully deleted config");
        });
    });

    after(() => {

    });

    it("configure kubectl", (done: MochaDone) => {
        let tp = path.join(__dirname, 'test-apply.js');
        tl.debug('tp: ' + tp);
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();
        expect(tr.succeeded).to.equal(true);

        tl.debug('config_file_path: ' + config_file_path);
        expect(isExistFile(config_file_path)).to.be.true;
        done();
    });

    it("execute kubectl apply", (done: MochaDone) => {
        let tp = path.join(__dirname, 'test-apply.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();
        tl.debug(tr.cmdlines);
        expect(tr.ran("./Tests/kubectl apply -f ./Tests/my-nginx.yml --kubeconfig ./kubeconfig")).to.be.true;
        done();
    });

    it("success when a user use hosted agent(linux)", (done: MochaDone) => {
        let tp = path.join(__dirname, 'test-apply.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();
        expect(tr.stderr.length, 0);
        done();
    }); 

    it("fails when a user use hosted agent(windows)", (done: MochaDone) => {
        let tp = path.join(__dirname, 'test-apply-oscheck.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();
        expect(tr.stderr.length).to.not.equal(0);
        tl.debug(tr.stderr.length.toString());
        tl.debug(tr.stderr);
        expect(tr.stderr).to.match(/.*This task does not work for Windows agent\./);
        done();
    }); 
});
