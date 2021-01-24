import Worker from '../Worker.js';

export default class Player {
  constructor() {
    this.money = 0;
    this.score = 0;
    this.upgrades = {
      1: [],
      2: [],
      3: [],
      4: []
    }
    this.workers = []
  }

  hasWon() {
    return this.score >= 3
  }
}
