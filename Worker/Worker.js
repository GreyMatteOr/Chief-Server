export default class Worker {
  constructor() {
    this.credentials = [];
    this.placed = false;
  }

  addCredential( credential ) {
    this.credentials.push(credential)
  }

  cost() {
    return 1 + (this.credentials * 2);
  }
}
