#!/usr/bin/env ts-node
'use strict';

import path from 'path';
import minimist from 'minimist';
import fs, { ReadStream } from 'fs';
import {parse, transform} from 'csv';

const args = minimist(process.argv.slice(2), {boolean: ['help', 'in'],string: ['file']});

if (args.help) {
  printHelp();
} else if (args.in || args._.includes('-')) {
  processFile(process.stdin.read());
} else if (args.file) {
  processFile(fs.createReadStream(path.resolve(args.file)));
} else {
  error('In-correct usage!\n');
  printHelp();
}

function processFile(readableStream: ReadStream) {
  const records: any[] = [];
  readableStream.on('end', () => {
    fs.writeFileSync('./output.json', JSON.stringify(records, null, 2));
  });
  readableStream.pipe(parse({
    delimiter: ';',
    columns: [
      'alpha2',
      'alpha3',
      'isoNum',
      'da',
      'en',
      undefined,
      undefined,
      undefined,
    ], 
    skip_empty_lines: true,
  })).pipe(transform((record: any) => {
    records.push(record);
  })
  ).pipe(process.stdout).end; // not JSON.stringified
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


function error(msg: string) {
  console.error(msg);
}
