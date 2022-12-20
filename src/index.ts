#!/usr/bin/env ts-node
"use strict";

import util from "util";
import path from "path";
import minimist from "minimist"
import fs from "fs"
import getStdin from "get-stdin"

const args = minimist(process.argv.slice(2), {boolean: ['help', 'in'],string: ['file']});

if (args.help) {
    printHelp();
} else if (args.in || args._.includes('-')) {
    getStdin().then(processFile).catch(error);
} else if (args.file) {
    fs.readFile(path.resolve(args.file), (err, contents) => {
        if (err) {
            error(err.toString());
        } else {
            processFile(contents.toString());
        }
    })
} else {
    error('In-correct usage!\n');
    printHelp();
}

function printHelp() {
    console.log('ex1 usage:');
    console.log('npx ts-node src/index.ts --file={FILENAME}');
    console.log('');
    console.log('--help                         print this help');
    console.log('--file={FILENAME}              process the file');
    console.log('--in, -                        process stdin');
    console.log('');
}

function processFile(contents: string) {
    process.stdout.write(contents);
}

function error(msg: string) {
    console.error(msg);
}
