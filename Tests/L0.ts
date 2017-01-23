/// <reference path="../typings/globals/chai/index.d.ts" />
/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/node/index.d.ts" />

import * as path from 'path';
import * as ttm from 'vsts-task-lib/mock-test';

var expect = require('chai').expect;

describe('Kubernetes Task', function() {
    before(() => {

    });

    after(() => {

    });

    it("configure kubectl", (done: MochaDone) => {
        let tp = path.join(__dirname, 'test-config.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        expect(tr.ran("/path/to/bin/kubectl get nodes")).to.be.true;
        expect(tr.succeeded).to.be.true;

        done();
    });

    it("execute kubectl apply", (done: MochaDone) => {
        expect(false).to.equal(true);
        done();
    });

});
