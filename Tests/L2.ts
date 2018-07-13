/// <reference path="../typings/globals/chai/index.d.ts" />
/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/node/index.d.ts" />


import * as path from 'path';
import * as ttm from 'vsts-task-lib/mock-test';
import * as tl from 'vsts-task-lib/task';


let chai = require('chai');
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

describe('Kubernetes download Task', function () {
    const istioctlDownloader : string = ".istioctldownloader.sh";
    const helmDownloader : string = ".helmdownloader.sh";
    before(() => {
        if (isExistFile(istioctlDownloader)) {
            fs.unlinkSync(istioctlDownloader);
        }
        if (isExistFile(".helmdownloader.sh")) {
            fs.unlinkSync(".helmdownloader.sh");
        }
    });

    after(() => {

    });

    it("download istio", (done: MochaDone) => {
        let tp = path.join(__dirname, 'test-download-istio.js');
        tl.debug('tp: ' + tp);
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();
        tl.debug(tr.cmdlines);
        chai.expect(tr.succeeded).to.equal(true);
        let downloadFile = path.join(".", istioctlDownloader);
        chai.expect(fs.readFileSync(istioctlDownloader, 'utf-8')).to.equal("curl -L https://github.com/istio/istio/releases/download/0.1.6/istio-0.1.6-linux.tar.gz | tar xz\ncp **/*/istioctl /opt/vsts/work/r1/a/.vstsbin");
        chai.expect(tr.ran("/bin/bash .istioctldownloader.sh")).to.be.true;
        done();
    });

    it("download helm", (done: MochaDone) => {

        let tp = path.join(__dirname, 'test-download-istio.js');
        tl.debug('tp: ' + tp);
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();
        chai.expect(tr.succeeded).to.equal(true);
        let downloadFile = path.join(".", helmDownloader);
        chai.expect(fs.readFileSync(helmDownloader, 'utf-8')).to.equal("curl -L https://storage.googleapis.com/kubernetes-helm/helm-v2.4.2-linux-amd64.tar.gz | tar xz\ncp **/helm /opt/vsts/work/r1/a/.vstsbin");
        chai.expect(tr.ran("/bin/bash .helmdownloader.sh")).to.be.true;
        done();
    });

    it("exec base command", (done: MochaDone) => {
        let tp = path.join(__dirname, 'test-base.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();
        chai.expect(tr.ran("./.vstsbin/istioctl version --managerAPIService=peeking-ostrich-istio-manager:8081 -v 5")).to.be.true;
        chai.expect(tr.succeeded).to.equal(true);
        done();
    })

});
