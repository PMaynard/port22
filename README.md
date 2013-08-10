Port 22
=======

This is the source code for port 22, security news feed.

## Features
Runs a self contained __node__ server, and aggregates [RSS]() and [Atom]() feeds into a clean and simple web interface. With __real-time updates__ using [JQuery]() and [WebSockets]().

## Usage
Run as a user who has privileges to listen on port 80. e.g. root.
>node port22.js

## Dependencies 
- [Socket.io]() 
- [Express]() 
- [MySQl](https://npmjs.org/package/mysql)

> npm install socket.io express mysql

