#!/usr/bin/env node
// ----------------------------------------------------------------------------

'use strict';
'use esversion: 6';

// ----------------------------------------------------------------------------

const path = require('path');
const PROGRAM = path.basename(process.argv[1]).replace(/\.js$/, '');
const VERSION = '1.2.0';

const program = require('commander');
const fs = require('fs');

const makeTests = require('./formatters').makeTests;
const read = require('./file').read;
const parse = require('./file').parse;
const write = require('./file').write;
const filename = require('./file').filename;

const debug = require('debug')(PROGRAM);
const verbose = require('debug');

// ----------------------------------------------------------------------------

program
  .version('1.0.0', '--version')
  .description(`${PROGRAM}: test supertest`)
  .usage('[options]')
  .option('-v, --verbose', 'enable verbose debug')
  .option('-s, --source <value>', 'the full path to a postman v2 collection file')
  .option('-d, --destination [value]', 'the full path destination file')
  .parse(process.argv);

program.verbose && verbose.enable('*');

if (!program.source) {
  console.log('Source option is required');
  program.help();
}
if (!fs.existsSync(program.source)) {
  console.error(`Source file ${program.source} does not exist`);
  program.help();
}

try {
  const contents = read(program.source);
  const parsed = parse(contents);
  const tests = makeTests(parsed.data);
  const file = filename(program.destination, parsed.data.info.name);
  write(file, tests);
  console.log(`File successfully written to ${file}`);
} catch (error) {
  if (typeof error === 'object') {
    console.log(error.message);
  } else {
    console.log(error);
  }
}
