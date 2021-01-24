//random functions
//these functions are used in multiple modules
const getRandomNumberBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  
const randomNum = () => {
    return Math.random();
  }
  
  export {
    getRandomNumberBetween,
    randomNum,
  }