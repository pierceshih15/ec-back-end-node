const assert = require('assert')
const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const should = chai.should()
const { expect } = require('chai')

const app = require('../../../app')
const db = require('../../../models')

describe('#Admin Order', () => {
  describe('GET orders', () => {
    before(async function() {
      await db.Order.destroy({ where: {}, truncate: true })

      await db.Order.create({ name: 'order1' })
      await db.Order.create({ name: 'order2' })
    })

    it('should render orders', done => {
      request(app)
        .get('/api/admin/orders')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.orders.length).to.be.equal(2)
          done()
        })
    })

    it('should render order', done => {
      request(app)
        .get('/api/admin/orders/1')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err)
          expect(res.body.order.name).to.be.equal('order1')
          done()
        })
    })

    after(async function() {
      await db.Order.destroy({ where: {}, truncate: true })
    })
  })
})
