class Game {
  constructor( players ) {
    this.id = Date.now();
    this.players = players;
    this.current = this.getRandom(players);
    console.log(players)
    this.error = players.length < 1 || 4 < players.length;
    this.turnCount = 0;
  }

  getRandom(arr) {
    let randIndex = Math.floor(Math.random() * arr.length);
    return arr[randIndex];
  }

  setNextPlayer() {
    let currIndex = this.players.indexOf(this.current);
    let nextIndex = (currIndex + 1) % this.players.length;
    this.current = this.players[nextIndex];
  }

  takeTurn(move) {
    let name = this.current.displayName;
    let isOver = this.checkGameEnd();
    let message = `${this.turnCount}: ${name} did ${move}!`
    this.setNextPlayer();
    this.turnCount++;
    if (isOver) message += `\n${name} won!`;
    return {message, isOver};
  }

  checkGameEnd() {
    return this.turnCount > 9;
  }
}

export default Game;
