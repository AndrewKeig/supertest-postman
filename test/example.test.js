const supertest = require('supertest')
const app = require('./app')

describe('example', () => {
  const host = 'localhost:3001'
  const accesstoken = '123456789'
  const profilePath = 'profile'
  
  describe('POST /profile', () => {
    it('returns with the correct response', done => {
      supertest(app)
        .post(`/${profilePath}`)
        .set('accesstoken', accesstoken)
        .set('host', host)
        .send({ name: 'andrew', mobile: '9030378009' })
        .expect(201)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })
  })
})
