const util = require('util');
const exec = util.promisify(require('child_process').exec);

describe('generate test', () => {
  beforeAll(async () => {
    const cmd = 'node src/index.js -s test/collection.json -d test/';
    await exec(cmd);
  });

  describe('when a valid postman file', () => {
    it('generates a file with tests', done => {
      done();
    });
  });
});
