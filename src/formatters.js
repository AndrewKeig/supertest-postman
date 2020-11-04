const indent = '\n'.padEnd(9, ' ')

const makeCode = (method = 'get') => {
  const codes = new Map()
  codes.set('get', 200)
  codes.set('post', 201)
  codes.set('put', 204)
  codes.set('patch', 204)
  codes.set('delete', 204)
  return codes.get(method) || 200
}

const makeUrl = (url = {}) => {
  return url && url.path ? `${url.path.join('/')}`.replace(/{{/gm,"${").replace(/}}/gm,"}") : ''
}

const makeHeaders = (headers = []) => {
  console.log('headers', headers)
  const response = headers.map(header => {
    if (header.value.includes('{{')) {
      return `.set('${header.key}', ${header.value
        .replace(/{{/g, '')
        .replace(/}}/g, '')})`
    } else {
      return `.set('${header.key}', '${header.value}')`
    }
  })

  return response && response.length > 0
    ? `${indent}${response.join(indent)}`
    : ''
}

const makeQuery = (query = []) => {
  const queries = query.map(q => `${q.key}: '${q.value}'`)
  const response = `.query({ ${queries.join(', ')} })`
  return queries && queries.length > 0 ? `${indent}${response}` : ''
}

const makeBody = (body = {}) => {
  if (body.mode === 'raw') {
    return `${indent}.send(${body.raw.replace(/"/g, "'")}) `
  }

  if (body.mode === 'urlencoded') {
    const queries = body.urlencoded.map(q => `${q.key}: '${q.value}'`)
    const response = `.send({ ${queries.join(', ')} })`
    return response && response.length > 0 ? `${indent}${response}` : ''
  }

  if (body.mode === 'formdata') {
    const queries = body.formdata.map(q => `${q.key}: '${q.value}'`)
    const response = `.send({ ${queries.join(', ')} })`
    return response && response.length > 0 ? `${indent}${response}` : ''
  }

  return ''
}

const makeVariables = (variables = []) => {
  const response = variables.map(v => {
    return `const ${v.key} = '${v.value}'`
  })

  return response && response.length > 0 ? response.join('\n  ') : ''
}

const createTest = (name, request) => {
  const content = [
    makeHeaders(request.header),
    makeQuery(request.url.query),
    makeBody(request.body)
  ]

  return `
  describe('${request.method} ${name}', () => {
    it('returns with the correct response', done => {
      supertest(app)
        .${request.method.toLowerCase()}(\`/${makeUrl(request.url)}\`)${content.join('')}
        .expect(${makeCode(request.method.toLowerCase())})
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })
  })`
}

exports.makeTests = collection => {
  const tests = collection.item.map(req => {
    const { request, name } = req
    return createTest(name, request)
  })

  return `const supertest = require('supertest')
const app = require('./app')

describe('${collection.info.name}', () => {
  ${makeVariables(collection.variable)}
  ${tests.join('\n')}
})
`
}
