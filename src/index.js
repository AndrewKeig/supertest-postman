#!/usr/bin/env node
const program = require('commander')
const handler = require('./handler').handler

program
  .version('1.0.0')
  .usage('[options] <file>')
  .description('Takes a postman collection v2 source file and generate and writes supertest tests to a destination folder.')
  .option('-s, --source <source>', 'the full path to a postman v2 collection file')
  .option('-d, --destination <destination>', 'the full path destination folder')
  .action((file, options) => {
    handler(file.source, file.destination)
  })
  .parse(process.argv)
