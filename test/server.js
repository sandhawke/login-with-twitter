'use strict'

const test = require('tape')
const http = require('http')
const express = require('express')
const request = require('request')
const TwAuth = require('..')
const config = require('../.secret')

process.on('unhandledRejection', (reason, p) => {
  console.error(process.argv[1], 'Unhandled Rejection at: Promise', p, 'reason:', reason)
  process.exit()
})

function start (serverConfig = {}, cb) {
  const app = express()

  let port = serverConfig.port || 0
  const server = http.createServer(app)
  server.listen(port, () => {
    const a = server.address()
    if (a.port !== port) console.error('listening on port', a)
    let portcode = ''
    if (a.port !== 80) portcode = ':' + a.port
    server.baseUrl = 'http://127.0.0.1' + portcode
    config.callbackUrl = server.baseUrl + '/twitter/callback'
    server.authUrl = server.baseUrl + '/twitter/authorize'

    const tw = new TwAuth(config)

    app.get('/twitter/login', (req, res) => {
      tw.login((err, url) => {
        if (err) throw Error(err)
        res.redirect(url)
      })
    })

    app.get('/twitter/authorize', (req, res) => {
      // console.log('access to /authorize')
      tw.authorize((err, url) => {
        if (err) throw Error(err)
        // console.log('result', [err, url])
        res.redirect(url)
      })
    })

    app.get('/twitter/callback', (req, res) => {
      // console.log('callback hit', req.url)
      tw.callback(req.query, (err, auth) => {
        if (err) throw Error(err)
        // console.log('auth info', auth)
        res.writeHead(200, {'Content-type': 'text/plain'})
        res.write('Twitter login successful.  See console')
        res.end()
        if (serverConfig.onlogin) serverConfig.onlogin(auth)
        // res.status(201).end()
      })
    })

    cb(server, app)
  })
}

test('can I contact myself?', t => {
  t.plan(1)
  start({port: 4042}, (server, app) => {
    app.get('/twitter/close', (req, res) => {
      res.status(201).end()
      server.close(err => {
        if (err) throw Error(err)
        t.pass('server closed')
        t.end()
      })
    })
    const url = config.callbackUrl.replace('/twitter/callback', '/twitter/close')
    // console.log('trying', url)
    request.get(url, (err) => {
      if (err) throw Error(err)
    })
  })
})

test('basic twitter auth', t => {
  t.plan(2)
  let server
  start({port: 4042, onlogin: login}, (serverArg, app) => {
    server = serverArg
    console.error('\n\nIn browser, visit:\n\n   ==>    ' + server.authUrl)
  })

  function login (auth) {
    console.error('login succeeded:\n' + JSON.stringify(auth, null, 2))
    t.pass('user authorized')
    t.comment('Done with browser.  Shutting down test server...')
    server.close(err => {
      if (err) throw Error(err)
      t.pass('server closed')
      t.end()
    })
  }
})
