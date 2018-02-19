# twitter-auth (fork of login-with-twitter) [![travis][travis-image]][travis-url] [![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url] [![javascript style guide][standard-image]][standard-url]

[travis-image]: https://img.shields.io/travis/sandhawke/login-with-twitter/master.svg
[travis-url]: https://travis-ci.org/sandhawke/login-with-twitter
[npm-image]: https://img.shields.io/npm/v/login-with-twitter.svg
[npm-url]: https://npmjs.org/package/login-with-twitter
[downloads-image]: https://img.shields.io/npm/dm/login-with-twitter.svg
[downloads-url]: https://npmjs.org/package/login-with-twitter
[standard-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[standard-url]: https://standardjs.com

### Login with Twitter. OAuth without the nonsense.

## Features

This module is designed to be the lightest possible wrapper on Twitter OAuth.

All this in < 100 lines of code.

## install

```
npm install login-with-twitter
```

## usage

Set up two routes on your web sever. We'll call them `/twitter` and
`/twitter/callback` but they can be named anything.

Initialize this module:

```js
const LoginWithTwitter = require('login-with-twitter')

const tw = LoginWithTwitter({
  consumerKey: '<your consumer key>',
  consumerSecret: '<your consumer secret>',
  callbackUrl: 'https://example.com/twitter/callback'
})
```

## testing

### Step 1. Be available on the web

If you're behind a firewall, use a tool like ngrok.

```
ngrok http 4042
```
and it assigns an address like `https://c4c356c3.ngrok.io`

### Step 2. Register a Twitter App

If you don't already have one, go to https://apps.twitter.com/app/new

The name needs to be unique across Twitter, and the callback URL should be the URL above plus /twitter/callback.  It does not to be working yet -- you can get your keys now -- but will need to work when you're actually doing logins.

Then click on then "Keys and Access Tokens", to get the "Consumer Key (API Key)" and "Consumer Secret (API Secret)".

Record these three values in a file, something like this:

```
cat <<_END > .secret.json
{
   "consumer_key": "E1f6Z48489494wsBGJalc1v5gl",
   "consumer_secret": "HjlcC46C2h242342534534545EPzEcTRIndBEusZ5aIgYgEmHmmu",
   "callback_url": "https://c4c356c3.ngrok.io/twitter/callback"
}
_END
```

### Step 3.

Now you can run the tests:

```
npm test
```

and follow the instructions in the browser that should pop up.


## license

MIT

Derived from https://github.com/feross/login-with-twitter