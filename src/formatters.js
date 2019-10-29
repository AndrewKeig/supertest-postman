
'use strict';

const debug = require('debug')('formatters');

// ----------------------------------------------------------------------------

const indent = '\n'.padEnd(9, ' ');

const makeCode = (method = 'get') => {
  const codes = new Map();
  codes.set('get', 200);
  codes.set('post', 201);
  codes.set('put', 204);
  codes.set('patch', 204);
  codes.set('delete', 204);
  return codes.get(method) || 200;
};

const makeUrl = (url = {}) => {
  return url && url.path ? `${url.path.join('/')}` : '';
};

const makeHeaders = (headers = []) => {
  const response = headers.map(header => {
    if (!header) {
      return '.set( "Content-Type", "application/json")';
    } else if (header.value.includes('{{')) {
      return `.set('${header.key}', ${header.value
        .replace(/{{/g, '')
        .replace(/}}/g, '')})`;
    } else {
      return `.set('${header.key}', '${header.value}')`;
    }
  });

  return response && response.length > 0
    ? `${indent}${response.join(indent)}`
    : '';
};

const makeQuery = (query = []) => {
  const queries = query.map(q => `${q.key}: '${q.value}'`);
  const response = `.query({ ${queries.join(', ')} })`;
  return queries && queries.length > 0 ? `${indent}${response}` : '';
};

const makeBody = (body = {}) => {
  if (body.mode === 'raw') {
    return `${indent}.send(${body.raw.replace(/"/g, "'")}) `;
  }

  if (body.mode === 'urlencoded') {
    const queries = body.urlencoded.map(q => `${q.key}: '${q.value}'`);
    const response = `.send({ ${queries.join(', ')} })`;
    return response && response.length > 0 ? `${indent}${response}` : '';
  }

  if (body.mode === 'formdata') {
    const queries = body.formdata.map(q => `${q.key}: '${q.value}'`);
    const response = `.send({ ${queries.join(', ')} })`;
    return response && response.length > 0 ? `${indent}${response}` : '';
  }

  return '';
};

const makeVariables = (variables = []) => {
  const response = variables.map(v => {
    return `const ${v.key} = '${v.value}'`;
  });

  return response && response.length > 0 ? response.join('\n  ') : '';
};

const createTest = (name, request) => {
  let content;
  let headers = [
    {
      key: 'Content-Type',
      value: 'application/json'
    }
  ];
  try {
    headers = request.header
      ? makeHeaders(request.header)
      : [
        {
          key: 'Content-Type',
          value: 'application/json'
        }
      ];
    // debugger
    content = [headers, makeQuery(request.url.query), makeBody(request.body)];
  } catch (err) {}

  return `
  describe('${request.method} ${name}', () => {
    it('returns with the correct response', done => {
      supertest(app)
        .${request.method.toLowerCase()}('/${makeUrl(
    request.url
  )}')${content.join('')}
        .expect(${makeCode(request.method)})
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })
  })`;
};

function makeTests (collection) {
  if (!collection.item) {
    throw new Error('Invalid input file');
  }
  const tests = collection.item.map(req => {
    const { request, name } = req;
    if (request) {
      return createTest(name, request);
    } else {
      debug('subtest version');
      let subtests = '';
      for (const element of req.item) {
        const { request, name } = element;
        subtests += createTest(`subtest ${name}  `, request);
      }
      return subtests;
    }
  });

  return `const supertest = require('supertest')
const app = require('./app')

describe('${collection.info.name}', () => {
  ${makeVariables(collection.variable)}
  ${tests.join('\n')}
})
`;
}

exports.makeTests = makeTests;
