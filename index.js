const querystring = require('querystring')
const request = require('request')

const TW_REQ_TOKEN_URL = 'https://api.twitter.com/oauth/request_token'
const TW_AUTH_URL = 'https://api.twitter.com/oauth/authenticate'
const TW_AUTHZ_URL = 'https://api.twitter.com/oauth/authorize'
const TW_ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token'

class LoginWithTwitter {
  constructor (opts) {
    // Check that required options exist
    if (!opts.consumerKey || typeof opts.consumerKey !== 'string') {
      throw new Error('Invalid or missing `consumerKey` option')
    }
    if (!opts.consumerSecret || typeof opts.consumerSecret !== 'string') {
      throw new Error('Invalid or missing `consumerSecret` option')
    }
    if (!opts.callbackUrl || typeof opts.callbackUrl !== 'string') {
      throw new Error('Invalid or missing `callbackUrl` option')
    }

    this.consumerKey = opts.consumerKey
    this.consumerSecret = opts.consumerSecret
    this.callbackUrl = opts.callbackUrl
    this.tokenSecrets = {}
  }

  authorize (cb) {
    return this.login(cb, TW_AUTHZ_URL)
  }

  login (cb, authUrl = TW_AUTH_URL) {
    const oauth = {
      consumer_key: this.consumerKey,
      consumer_secret: this.consumerSecret,
      callback: this.callbackUrl
    }

    // Get a "request token"
    request.post({ url: TW_REQ_TOKEN_URL, oauth: oauth }, (err, _, body) => {
      // console.log('request.post resulted in', err, body)
      if (err) return cb(err)

      const {
        oauth_token: token,
        oauth_token_secret: tokenSecret,
        oauth_callback_confirmed: callbackConfirmed
      } = querystring.parse(body)

      // Must validate that this param exists, according to Twitter docs
      if (callbackConfirmed !== 'true') return cb(err)

      // Redirect visitor to this URL to authorize the app
      const url = `${authUrl}?${querystring.stringify({ oauth_token: token })}`

      // Remember the secret for this token, for the callback
      this.tokenSecrets[token] = tokenSecret

      // console.log('cb to url', url)
      return cb(null, url)
    })
  }

  callback (params, cb) {
    const {
      oauth_token: token,
      oauth_verifier: verifier
    } = params

    // Check that required params exist
    if (!cb || typeof cb !== 'function') {
      throw new Error('Invalid or missing `cb` parameter for login callback')
    }
    if (!params.oauth_token || typeof params.oauth_token !== 'string') {
      cb(new Error('Invalid or missing `oauth_token` parameter for login callback'))
    }
    if (!params.oauth_verifier || typeof params.oauth_verifier !== 'string') {
      cb(new Error('Invalid or missing `oauth_verifier` parameter for login callback'))
    }

    const tokenSecret = this.tokenSecrets[token]
    if (!tokenSecret || typeof tokenSecret !== 'string') {
      cb(new Error('No stored tokenSecret for this token'))
      return
    }
    delete this.tokenSecrets[token]

    const oauth = {
      consumer_key: this.consumerKey,
      consumer_secret: this.consumerSecret,
      token: token,
      token_secret: tokenSecret,
      verifier: verifier
    }

    // Get a user "access token" and "access token secret"
    request.post({ url: TW_ACCESS_TOKEN_URL, oauth: oauth }, (err, _, body) => {
      if (err) return cb(err)

      // Ready to make signed requests on behalf of the user
      const {
        oauth_token: userToken,
        oauth_token_secret: userTokenSecret,
        screen_name: userName,
        user_id: userId
      } = querystring.parse(body)

      cb(null, {
        userName,
        userId,
        userToken,
        userTokenSecret
      })
    })
  }
}

module.exports = LoginWithTwitter
