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

  let { userName, pw } = req.body;
  if (!verify([{userName, pw}])) resp.sendStatus(400);

  let newKey = Math.floor(Math.random() * 10000);
  app.locals.users[userName].authKey = newKey
  resp.status(200).json(newKey);
});

app.post('/logout', (req, resp) => {

  let {userName, authKey} = req.body;
  if (!verify([{userName, authKey}])) resp.sendStatus(400);

  app.locals.users[userName].authKey = null;
  resp.sendStatus(204);
});

app.post('/game', (req, resp) => {
  let { users } = req.body;
  if (!verify(users)) return resp.sendStatus(400);

  let game = new Game(users);
  if (game.error) return resp.sendStatus(400);

  users.forEach( user => {
    app.locals.users[user.name].game = game
  })
  resp.status(201).json(game.id);
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is hosting on ${app.get('port')}`);
});

function verify(users) {
  for (let i = 0; i < users.length; i++) {
    let {userName, pw, authKey} = users[i];
    let userDoesntExist = app.locals.users[userName] === undefined;
    let pwMatches = app.locals.users[userName].pw === pw;
    let authKeyMatches = app.locals.users[userName].authKey == authKey && authKey !== null;
    if ( userDoesntExist || !(pwMatches || authKeyMatches)) {
      return false;
    }
  }
  return true;
}

// console.log(verify([{ "userName": "bill@bb.com", "authKey": 7352}]));
