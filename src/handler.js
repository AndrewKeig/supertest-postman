const makeTests = require('./formatters').makeTests
const read = require('./file').read
const parse = require('./file').parse
const write = require('./file').write
const filename = require('./file').filename

exports.handler = (source, destination) => {
  if (!source) {
    console.log('Please provide a full path to a postman source, --s')
  }

  if (!destination) {
    console.log('Please provide a full path to a destination, --d')
  }

  try {
    const contents = read(source)
    const parsed = parse(contents)
    const tests = makeTests(parsed.data)
    const file = filename(destination, parsed.data.info.name)
    write(destination, file, tests)
    console.log(`File successfully written to ${file}`)
  } catch (error) {
    console.log(error)
  }
}
