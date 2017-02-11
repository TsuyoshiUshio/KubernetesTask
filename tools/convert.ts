/// <reference path="../typings/globals/node/index.d.ts" />

import fs = require('fs');
import path = require('path');

function isBase64(content){
    let base64Regx = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/
    return base64Regx.test(content);
}

async function run() {
    let filename = 'config';
    if (process.argv.length === 3) {
        filename = process.argv[2];
    }
    let content  = fs.readFileSync(filename);
    let newContent: string = new Buffer(content).toString('base64');
    let filePath = path.join(process.cwd(), filename + "_new");
    await fs.writeFile(filePath, newContent, (x) => {});
    let decoded :string = new Buffer(newContent, 'base64').toString();
    filePath = path.join(process.cwd(), filename + "_decode");
    await fs.writeFile(filePath, decoded, (x) => {} );

    let result = isBase64(content) + ":" + isBase64(newContent);
    filePath = path.join(process.cwd(), "result.txt");
    await fs.writeFile(filePath, result, (x) => {});
    
}
run();
