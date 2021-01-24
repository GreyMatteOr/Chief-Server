import Board from './Board/Board.js';
import {Blue, Green, Yellow, Red} from '../Players';

export default class Game {
  constructor() {
    this.Board =
    this.players = [Red, Blue, Yellow, Green]
  }

  isGameOver() {
    return this.players.some( player => player.hasWon() );
  }
}
