# twauthorize

This is a fork of login-with-twitter, adding **authorization**, so you
end up able to do things with the user's twitter account, not just
having the user identified.

One should perhaps use passport + oauthorize, but I wanted something
smaller and easier for me to understand, for now.

## install

```
npm install twauthorize
```

## usage

Set up two routes on your web sever. We'll call them `/twitter` and
`/twitter/callback` but they can be named anything.

Initialize this module:

```js
const TwAuth = require('twauthorize')

const tw = TwAuth({
  consumerKey: '<your consumer key>',
  consumerSecret: '<your consumer secret>',
  callbackUrl: 'https://example.com/twitter/callback'
})
```

For more, see the test.

## testing

### Step 1. Register a Twitter App

If you don't already have one, go to https://apps.twitter.com/app/new

The name needs to be unique across Twitter, and the callback URL can be anything, eg https://example.com/twitter/callback.  It's not actually used, because we override it later.

Then click on then "Keys and Access Tokens", to get the "Consumer Key (API Key)" and "Consumer Secret (API Secret)".

Record these values in a file, something like this:

```
cat <<_END > .secret.json
{
   "consumerKey": "E1f6Z48489494wsBGJalc1v5gl",
   "consumerSecret": "HjlcC46C2h242342534534545EPzEcTRIndBEusZ5aIgYgEmHmmu",
}
_END
```

### Step 2.

Now you can run the tests:

```
npm test
```

then visit the displayed URL in a browser and login.

## license

MIT

Derived from https://github.com/feross/login-with-twitter