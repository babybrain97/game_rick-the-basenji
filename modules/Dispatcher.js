import { getRandomNumberBetween } from './utilities.js';

class Dispatcher {

  constructor(callback, frequencyA, frequencyB) {
    this.callback = callback;
    this.loop();

    this.frequencyA = frequencyA * 1000;
    this.frequencyB = frequencyB * 1000;

  }

  //frequency: every 2-4 seconds
  loop = () => {
    setTimeout(() => {
      // call the callback function
      this.callback();
      // call loop function again
      this.loop();

    }, getRandomNumberBetween(this.frequencyA, this.frequencyB)) // wait between 2-6 seconds
  }
}

export default Dispatcher;