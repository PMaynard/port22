Port 22
=======

This is the source code for port 22, security news feed.

## Features
Runs a self contained __node__ server, and aggregates [RSS](https://en.wikipedia.org/wiki/Rss) and [Atom](https://en.wikipedia.org/wiki/Atom_%28standard%29) feeds into a clean and simple web interface. With __real-time updates__ using [JQuery](http://jquery.com/) and [WebSockets](http://www.websocket.org/).

## Usage
Run as a user who has privileges to listen on port 80. e.g. root.
>node port22.js

## Dependencies 
- [Socket.io](http://socket.io) 
- [Express](http://expressjs.com) 
- [MySQl](https://npmjs.org/package/mysql)
- [FeedParser](https://github.com/danmactough/node-feedparser)
- Cron

> npm install socket.io express mysql feedparser cron

Or use `npm install` if you're happy with the package.json.

## Install

    apt-get install nodejs npm mysql
    mysql -u root < init-db.sql
    gunzip port22.sql.gz
    mysql -u root < port22.sql
    npm install socket.io express mysql feedparser
