import express from 'express'
import Game from './Game/Game.js'

const app = express();
app.use(express.json())

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Chief Gamehost';
app.locals.users = {
  'bill@bb.com': {
    pw: 'asd',
    displayName: 'Bill',
    game: null,
    authKey: null
  }
}

app.post('/login', (req, resp) => {

  let { name, pw } = req.body;
  if (!verify({name, pw})) resp.status(403).json('Wrong User ID or PW');

  let newKey = Math.floor(Math.random() * 10000);
  app.locals.users[name].authKey = newKey
  resp.status(200).json(newKey);
});


app.post('/logout', (req, resp) => {

  let {name, authKey} = req.body;
  if (!verify({name, authKey})) resp.status(403).json('Invalid Certification');

  app.locals.users[name].authKey = null;
  resp.sendStatus(204);
});


app.post('/game', (req, resp) => {
  let { users } = req.body;
  if (!verifyAll(users)) return resp.status(400).json('Invalid User Data');

  users = users.map( user => {
    user.displayName = app.locals.users[user.name].displayName;
    return user;
  })
  let game = new Game(users);
  if (game.error) return resp.status(400).json('Game.players error');

  users.forEach( user => {
    app.locals.users[user.name].game = game
  })
  resp.status(201).json(game.id);
});

app.post('/turn', (req, resp) => {
  let { name, authKey, move } = req.body;
  if (!verify({ name, authKey })) return resp.status(400).json("Not Authorized");

  let game = app.locals.users[name].game;
  if ( game === null ) return resp.status(400).json("No ongoing game");
  if ( game.current.name !== name ) resp.status(400).json("Not current player");

  let turn = game.takeTurn(move);
  if (turn.isOver) game.players.forEach( player => app.locals.users[player.name].game = null);

  return resp.status(200).json(turn.message);
});


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is hosting on ${app.get('port')}`);
});


function verify(user) {
  let {name, pw, authKey} = user;
  if (app.locals.users[name] === undefined) return false;

  let correctPW = app.locals.users[name].pw === pw;
  let isAuthed = app.locals.users[name].authKey === authKey && authKey !== null;
  if (!(correctPW || isAuthed)) return false;
  return true;
}

function verifyAll(users) {
  for (let i = 0; i < users.length; i++) {
    if (!verify(users[i])) return false;
  }
  return true;
}
