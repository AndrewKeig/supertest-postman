'use strict';

const fs = require('fs');
const debug = require('debug')('file');

// ----------------------------------------------------------------------------

exports.read = source => {
  try {
    return fs.readFileSync(source, { encoding: 'utf-8' });
  } catch (e) {
    throw new Error(
      'Unable to find or read source file, please check source location'
    );
  }
};

exports.parse = file => {
  const schema =
    'https://schema.getpostman.com/json/collection/v2.1.0/collection.json';
  const error = 'Please provide a valid postman v2.1.0 collection';

  try {
    const data = JSON.parse(file);
    return data && data.info && data.info.schema !== schema
      ? { error }
      : { data };
  } catch (e) {
    throw new Error(error);
  }
};

exports.write = (filename, tests) => {
  try {
    fs.writeFileSync(filename, tests, {
      encoding: 'utf-8'
    });
  } catch (e) {
    throw new Error(
      'Unable to write to file location',
      `${filename}.test.js`
    );
  }
};

exports.filename = (destination, testname) => {
  // we either use the provided destination or a tidy version of the testname
  testname = testname.replace(/[ (){}\[\]]/g, '').replace(/[ +/\\&;#]/g, '_').replace(/_+$/, '');
  destination = destination || `${testname}.test.js`;
  return destination;
};
