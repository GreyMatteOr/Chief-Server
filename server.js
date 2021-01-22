const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').createServer(app);
let users = {};

const io = require("socket.io")(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(cors());
app.set('port', process.env.PORT || 3000);

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
