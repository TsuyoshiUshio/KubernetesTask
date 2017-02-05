/// <reference path="../typings/globals/chai/index.d.ts" />
/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/node/index.d.ts" />


import * as path from 'path';
import * as ttm from 'vsts-task-lib/mock-test';
import * as tl from 'vsts-task-lib';


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

describe('Kubernetes Task', function () {
    before(() => {

        fs.unlink(config_file_path, function (err) {
            if (err) tl.debug("config not found (It's OK.)");
            tl.debug("Sucessfully deleted config");
        });
    });

    after(() => {

    });


    it("configure kubectl", (done: MochaDone) => {
        let tp = path.join(__dirname, 'test-general.js');
        tl.debug('tp: ' + tp);
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();
        expect(tr.succeeded).to.equal(true);
        expect(isExistFile(config_file_path)).to.be.true;
        done();
    });

    it("execute kubectl apply", (done: MochaDone) => {
        let tp = path.join(__dirname, 'test-general.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();
        tl.debug(tr.cmdlines);
        expect(tr.ran("./Tests/kubectl apply -f ./Tests/my-nginx.yml --kubeconfig ./config")).to.be.true;
        done();
    });

});
