/// <reference path="../typings/globals/chai/index.d.ts" />
/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/node/index.d.ts" />

import * as path from 'path';
import * as ttm from 'vsts-task-lib/mock-test';

console.log("step1");
var expect = require('chai').expect;
var fs = require('fs');
console.log("step2");

describe('Kubernetes Task', function() {
    before(() => {

    });

    after(() => {

    });


    it("configure kubectl", (done: MochaDone) => {
        let tp = path.join(__dirname, 'test-config.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();
        expect(tr.succeeded).to.equal(true);
        
        fs.access(path.join(process.cwd(),path.join('Tests', 'config')), function (err) {
            expect(err).to.be.false
        });

        done();
    });

    it("execute kubectl apply", (done: MochaDone) => {
        let tp = path.join(__dirname, 'test-config.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();
        console.log(tr.cmdlines);
        expect(tr.ran("\"./Tests/kubectl apply -f ./Tests/my-nginx.yml --kubeconfig config\"")).to.be.true;
        done();
    });

});
