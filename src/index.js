const commander = require('commander')
const handler = require('./handler').handler

const program = new commander.Command()

program
  .version('1.0.0')
  .usage('[options] <file>')
  .option('--s, --source', 'the full path to a postman v2 collection file')
  .option('--d, --destination', 'the full path destination folder')
  .action(handler)
  .parse(process.argv)
