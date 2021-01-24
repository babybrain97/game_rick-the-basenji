import Dog from './modules/Dog.js';
import Bones from './modules/Bones.js'
import Hearts from './modules/Hearts.js'
import { getRandomNumberBetween } from './modules/utilities.js'

//CONFIGURATION
const CONFIG = {
  width: 950,
  height: 600,
}

let context;
let player;
let bones = [];
let hearts = [];

//frequency
let frequencyMin;
let frequencyMax;

let heartsDispatcher;
let points;
let lives;
let boneCollectedSound;
let heartCollectedSound;
let gameOverSound;
let bonesDispatcher;

function setInitialValues() {
  points = 0;
  lives = 3;
  frequencyMin = 2;
  frequencyMax = 4;
}


//INITIALISATION
const init = () => {

  //canvas: settings, 2D context, width, height
  let canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');


  canvas.setAttribute('width', CONFIG.width);
  canvas.setAttribute('height', CONFIG.height);

  canvas.style.width = CONFIG.width + 'px';
  canvas.style.height = CONFIG.height + 'px';


  // PLAYER module
  player = new Dog(CONFIG);

  //reseting the values when clicking restart game
  setInitialValues();

  //soundeffects
  /* @Sound effects obtained from www.zapsplat.com */
  boneCollectedSound = new Audio('./audio/bone.mp3')
  heartCollectedSound = new Audio('./audio/heart.mp3')
  gameOverSound = new Audio('./audio/gameOver.mp3')

  //Hearts
  heartsDispatcher = () => {
    //random X position
    let newX = getRandomNumberBetween(0, CONFIG.width - 45);
    let newHeart = new Hearts(CONFIG, newX);
    hearts.push(newHeart);
    if (lives > -1) {
      setTimeout(heartsDispatcher, getRandomNumberBetween(20 * 1000, 40 * 1000))
    } else {
      clearTimeout (heartsDispatcher)
    }
  }

  bonesDispatcher = function() {
    let newX = getRandomNumberBetween(0, CONFIG.width - 45);
    let newBone = new Bones(CONFIG, newX);
    bones.push(newBone);
    if (lives > -1) {
      setTimeout(bonesDispatcher, getRandomNumberBetween(frequencyMin * 1000, frequencyMax * 1000))
    } else {
      clearTimeout (bonesDispatcher)
    }
  }

  heartsDispatcher();
  bonesDispatcher();

  gameLoop();
}

const update = () => {
  if (document.getElementById('game').classList.contains('active')) {
    bones.forEach((bone, index) => {
      //collision detected, player gains point, a sound is played
      if (detectCollision(player, bone)) {
        bones.splice(index, 1);
        points++;
        boneCollectedSound.play();
      }
      //collision is not detected, player loses points
      if (bone.getBoundingBox().y > CONFIG.height) {
        bones.splice(index, 1);
        lives--;
      }
    });
    //collision detected, player gains a life, a sound is played
    hearts.forEach((heart, index) => {
      if (detectCollision(player, heart)) {
        hearts.splice(index, 1);
        lives++;
        heartCollectedSound.play();
      }
    });

    //game gets harder according to collected points
    if ( 40 < points && points > 70){
      frequencyMin = 0.5;
      frequencyMax = 1;
    }
    if (points > 40 && points < 70) {
      frequencyMax = 1.7;
    }
    else if (15 < points && points < 40){
      frequencyMin = 0.8;
    }
    else if (5 < points && points < 15) {
      frequencyMax = 2;
      frequencyMin = 1;
    }
    else if (points > 5){
      frequencyMax = 3;
      frequencyMin = 1;
    }
    
    
    //calling gameOver when player loses all their lives
    if (lives < 0) {
      gameOver();
    }

    //displaying points top right corner, DOM manipulation
    document.getElementById("points").innerHTML = points;
    document.getElementById("lives").innerHTML = lives;

    //updating position of the game objects in the arrays
    player.update();
    bones.forEach((bone) => {
      bone.update();
    });

    hearts.forEach((heart) => {
      heart.update();
    });

  }
}
//rendering the game
const render = () => {
  //clear the canvas before rendering
  context.clearRect(0, 0, CONFIG.width, CONFIG.height);
  //rendering objects
  player.render(context);
  bones.forEach((bone) => {
    bone.render(context);
  });
  hearts.forEach((heart) => {
    heart.render(context);
  });
}

const gameLoop = () => {
  update();
  render();
  //changing the state of the game to active, manipulating dom accordingly
  if (document.getElementById('game').classList.contains('active')) {
    requestAnimationFrame(gameLoop);
  }
}
//collision detection
const detectCollision = (gameObjectA, gameObjectB) => {
  // get boundingbox 
  //bbA bounding box A
  let bbA = gameObjectA.getBoundingBox();
  //bbB bounding box B
  let bbB = gameObjectB.getBoundingBox();
  // check for collisions
  if (
    bbA.x + bbA.width > bbB.x &&
    bbA.x < bbB.x + bbB.width &&
    bbA.y + bbA.height > bbB.y &&
    bbA.y < bbB.y + bbB.height
  ) {
    return true;
  } else {
    return false;
  }
}

function startGame() {
  //using classes to switch between screens
  document.getElementById('game').classList.remove('over')
  document.getElementById('game').classList.add('active');
  init();
}

function gameOver() {
  //playing sound
  gameOverSound.play();
  //saving points and displaying the high score
  //first if: game has never been played before
  if (localStorage.getItem('highScore') === null) {
    localStorage.setItem('highScore', points);
    document.getElementById('highscore').innerText = 'new highscore! ' + points;
  }
  //else if: game has been played before, player beat his highscore
  else if (points > localStorage.getItem('highScore')) {
    localStorage.highScore = points;
    document.getElementById('highscore').innerText = 'new high score! ';
  }
  //no new highscore, accessing the high score in localStorage
  else {
    document.getElementById('highscore').innerText = 'high score: ' + localStorage.getItem('highScore');
  }
  //clearing the bones dispatcher
  clearTimeout(bonesDispatcher);
  clearTimeout(heartsDispatcher);
  //changing the screen to game over
  document.getElementById('game').classList.remove('active')
  document.getElementById('game').classList.add('over');
  //displaying the points
  document.getElementById('score').innerText = 'score: ' + points;
}

//starting or restarting the game when clicking the button
document.querySelector('.start').onclick = startGame;
document.querySelector('.restart').onclick = startGame;