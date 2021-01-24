const express = require('express');
const app = express();
const cors = require('cors');
const pgp = require('pg-promise')(/* options */)
app.use(express.json());
app.use(cors());
app.set('port', process.env.PORT || 3000);
const server = require('http').createServer(app);

let rules = {}
let users = {};

const io = require("socket.io")(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"]
  }
});

const db = pgp('postgres://matthewlane:1234@localhost:5432/chief')

db.one('SELECT $1 AS value', 123)
  .then(function (data) {
    console.log('DATA:', data.value)
  })
  .catch(function (error) {
    console.log('ERROR:', error)
  })

io.on( 'connect', ( socket ) => {
  console.log('A user has connected!');
  users[socket.id] = {};

  socket.on('disconnect', () => {
    console.log('A user has disconnected! ID:', socket.id);
    delete users[socket.id];
  });
})

server.listen(app.get('port'), () => {
  console.log(`Listening on port ${app.get('port')}.`);
});
