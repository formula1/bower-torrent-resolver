# torrent-bower-resolver v0.0.1
A Torrent resolver for Bower

# Usage:

Include `"torrent-bower-resolver"` in your .bowerrc:

    {
      "resolvers": [
        "torrent-bower-resolver"
      ]
    }

Then add a magnet uri to your in your bower.json:

    "dependencies": {
        "repo": "magnet:?xt.1=urn:sha1:SOMEMAGNETURI"
    }


# Known issues:

- There is no support for Branches or tags at this point in time
- Will not provide available sources from a given tracker. This is meant for downloading only.
- Does not support dht at this time
