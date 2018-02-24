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

## Usage

For now, see the test/server.js

## Testing

### Step 1. Register a Twitter App

If you don't already have one, go to https://apps.twitter.com/app/new

The name needs to be unique across Twitter, and the callback URL can be anything, eg https://example.com/twitter/callback.  It's not actually used, because we override it at runtime.

Then click on then "Keys and Access Tokens", to get the "Consumer Key (API Key)" and "Consumer Secret (API Secret)".

Record these values in a file, something like this:

```
cat <<_END > .secret.json
{
   "consumerKey": "E1f6Z48489494wsBGJalc1v5gl",
   "consumerSecret": "HjlcC46C2h242342534534545EPzEcTRIndBEusZ5aIgYgEmHmmu",
}
_END

... or otherwise make sure they get to our constructor.

```

### Step 2.

Now you can run the tests:

```
npm test
```

It'll tell you to visit a URL.  Do that.  You should see Twitter
asking if it's okay to authorize your app.  Say yes and the test
should complete successfully.

## license

MIT

Derived from https://github.com/feross/login-with-twitter