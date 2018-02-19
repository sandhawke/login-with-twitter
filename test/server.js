'use strict'

const test = require('tape')
const http = require('http')
const express = require('express')
const request = require('request')
const opn = require('opn')
const LoginWithTwitter = require('..')
const config = require('./.secret')

function start (serverConfig = {}, cb) {
  const app = express()

  let port = serverConfig.port || 0
  const server = http.createServer(app)
  server.listen(port, () => {
    const a = server.address()
    if (a !== port) console.error('listening on port', a)

    const tw = new LoginWithTwitter(config)

    app.get('/twitter/login', (req, res) => {
      tw.login((err, url) => {
        if (err) throw Error(err)
        res.redirect(url)
      })
    })

    app.get('/twitter/authorize', (req, res) => {
      tw.authorize((err, url) => {
        if (err) throw Error(err)
        res.redirect(url)
      })
    })

    app.get('/twitter/callback', (req, res) => {
      tw.callback(req.query, (err, auth) => {
        if (err) throw Error(err)
        console.log('auth info', auth)
        res.status(201).end()
      })
    })

    cb(server, app)
  })
}

test('can I contact myself?', t => {
  t.plan(1)
  start({port: 4042}, (server, app) => {
    app.get('/close', (req, res) => {
      res.status(201).end()
      server.close(err => {
        if (err) throw Error(err)
        t.pass('server closed')
        t.end()
      })
    })
    const url = config.callbackUrl.replace('/twitter/callback', '/close')
    request.get(url, (err) => {
      if (err) throw Error(err)
    })
  })
})

test('basic twitter auth', t => {
  t.plan(1)
  start({port: 4042}, (server, app) => {
    /* server.close(err => {
      if (err) throw Error(err)
      t.pass('server closed')
      t.end()
    })
    */
    const url = config.callbackUrl.replace('/twitter/callback', '/twitter/authorize')
    opn(url)
  })
})
