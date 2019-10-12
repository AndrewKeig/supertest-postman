const supertest = require('supertest')
const app = require('./app')

describe('example', () => {
  const host = 'localhost:3001'
  const accesstoken = '123456789'
  
  describe('POST /profile', () => {
    it('returns with the correct response', done => {
      supertest(app)
        .post('/profile')
        .set('accesstoken', accesstoken)
        .set('host', host)
        .send({ name: 'andrew', mobile: '9030378009' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })
  })
})
