'use strict';

const express = require('express');
const socket = require('socket.io');
const crypto = require('crypto');

function timer(start) {

  return function() {

    var time = Date.now();
    var diff = start ? time - start : 0;
    start = time;
    return diff;

  };

}

/**
 * Create the express server and add the socket.io connection. If a livereload
 * server is passed in (on dev) use it.
 * @param  {function} livereload An optional livereload server instance
 * @return {app: express, port: number, lrport: number}
 */
module.exports = function(livereload) {

  // create the express app

  const app = express();
  const server = require('http').Server(app);
  const io = socket(server);
  const port = process.env.PORT || 3000;
  const lrport = process.env.LR_PORT || 35729;

  // only add snippet if livereload passed into function (from gulp)

  if (livereload) {
    app.use(livereload({port: lrport}));
  }

  // serve from the public folder and bower_components

  app.use(express.static('./public'));
  app.use(express.static('./bower_components'));

  // all non-static requests should return index.html

  app.all('/*', (req, res) => {
    res.sendfile('index.html', {root: 'public'});
  });

  server.listen(port);

  // 1-to-1 connection

  var games = {};

  io.on('connection', (socket) => {

    let gameCode = crypto.randomBytes(2).toString('hex');

    // when a join-desktop event happens, start a new game with the code
    // generated for this socket and save the properties of the game to the
    // games hash for lookup later

    socket.on('join-desktop', () => {

      games[gameCode] = {desktop: socket.id, mobile: null};
      socket.join(gameCode);
      socket.emit('game-code', gameCode);
      console.log('starting game ' + gameCode);

    });

    // when a join-mobile event happens, look for a game to match the code
    // sent with the event. if a game exists and needs a mobile socket,
    // join the game and send a game-start event

    socket.on('join-mobile', (code) => {

      let game = games[code];

      if (!game) {

        socket.emit('game-error', 'No game to join.');

      } else if (game && game.mobile) {

        socket.emit('game-error', '2nd screen has already joined this game.');

      } else {

        gameCode = code;
        game.mobile = socket.id;
        socket.join(code);
        io.to(code).emit('game-start', code);
        console.log('game ' + code + ' ready...');

      }

    });

    // when a socket disconnects, look up the game

    socket.on('disconnect', () => {

      let game = games[gameCode];

      if (game) {

        io.to(gameCode).emit('game-over');
        console.log('game ' + gameCode + ' ending...');
        delete games[gameCode];

      }

    });

    // when gyro data is received, echo it back out
    // to the sockets in the game

    let moveTimer = timer();

    socket.on('move-mobile', (delta) => {

      io.to(gameCode).emit('move-desktop', delta);

      console.log('move-server', moveTimer());

    });

  });

  return {app: app, port: port, lrport: lrport}

};
