//TODO: Timed Levels
//TODO: Different Modes

// Place all enemy objects in an array called allEnemies
var allEnemies = [];

//Initiate player outside window closure required by strict mode.
var player;

(function(window){
  "use strict";

  //------- Config Function
  // Returns a random integer between min (included) and max (excluded)
  function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1) - min);
  }

  //TODO: Write a function that can be called to write on the canvas
  // function write (text, x, y) {
  //   ctx.font = "30px arcadeclassic";
  //   ctx.fillStyle = "black";
  //   ctx.fillText(text, x, y);
  // };

  //----- Game Config
  //TODO: Refactor config in external file
  var config = {
      playerX:404,
      // playerX: getRandomInt(30, 780),
      initScore: 0,
      enemyNumber: 6,
      lives: 3 //Lives of the player
  };

  // The Hitbox handles are the base properties to be handled outside of the method closure
  var hitbox = {
      life: true
  };

  // The constants that contains the enemys in the paved block.
  var CONSTANTS = {
    TOP: 55,
    MIDDLE: 145,
    BOTTOM: 225,
    STEP_DISTANCE: 101,
    PLAYERHEIGHT: 201,
    PLAYERWIDTH: 101,
    ENEMYHEIGHT: 71,
    STARTPOSITION: 404,
    MINSPEED: 300,
    MAXSPEED: 900,
    ENEMYEXIT: 810,
    ENEMYSTART: -120,
    ENEMYWIDTH: 101
  };

  // -------- ENEMY
  //Class of our Enemies
  var Enemy = function(x, y, speed) {
      this.sprite = "images/enemy-bug.png";
      this.y = y;
      this.x = x;
      this.height = CONSTANTS.ENEMYHEIGHT;
      this.width = CONSTANTS.ENEMYWIDTH;
      this.speed = speed;
  };

  // Parameter: dt, a time delta between ticks
  // Update the enemy x position and call randomAlignment function to make him start on another Y Point
  Enemy.prototype.update = function(dt) {
      this.x += this.speed * dt;
      if (this.x > CONSTANTS.ENEMYEXIT) {
          this.x = CONSTANTS.ENEMYSTART;
          // Call Function Alignment that gives a new Y axis random position.
          this.y = this.randomAligment();
      }
      // Fire the Collision Method on Collision Detection
      this.collision();

    };

Enemy.prototype.collision = function() {
  // Collision Detection
  // TODO Make a function of this mess
  if (player.x < this.x + CONSTANTS.ENEMYWIDTH &&
      player.x + CONSTANTS.PLAYERWIDTH > this.x &&
      player.y < this.y + CONSTANTS.ENEMYHEIGHT &&
      CONSTANTS.PLAYERHEIGHT + player.x > this.y) {
      window.console.log("Diiiiiiiiiiiieeeee");
      hitbox.life = false;
      // Fires player lifes when collision is detected
      player.life(hitbox.life, config.lives);
  }
};



  // sets Y coordinate for each enemy to 55, 145, and 225 by using incrementer

  // This function pic a random property of Object EnemyAlign
  // in order to contain and distribute the enemies in the paved block.
  Enemy.prototype.randomAligment = function () {
      var alignment = [CONSTANTS.TOP, CONSTANTS.MIDDLE, CONSTANTS.BOTTOM];
      // Math.ceil(Math.random()) doesn't work in this case, I have no Idea why.
      return alignment[alignment.length * Math.random() << 0];
  };

  // Render the enemy on the screen by calling drawImage canvas API method
  Enemy.prototype.render = function() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };


  // --------- PLAYER

  // Class of our player
  //TODO Choose between multiple players
  //TODO Finish Implement score
  var Player = function(x, y) {
      this.sprite = "images/char-boy.png";
      this.x = x;
      this.y = y;
      this.lives = config.lives;
      this.height = CONSTANTS.PLAYERHEIGHT;
      this.width = CONSTANTS.PLAYERWIDTH;
      this.score = config.initScore;
  };

  //Update the player every X seconds
  Player.prototype.update = function() {
      //If the Player reach the water he his teleported back on the grass ( Y: 404 )
      // Add 10 Points on every dive in the water
      //TODO Implement Score
      if (this.y <= 0) {
          this.score += 10;
          //Add 1 Enemies on each cross
          config.enemyNumber++;
          window.console.log(config.enemyNumber);
          this.y = 404;
      }
  };

  Player.prototype.state = function(lives) {
    // will be used for statistics of the player
    //TODO Implement ( in this order ) Lives - Time - Score
  };

  //Liiife, Check if the player is dead or not.
  // If the player is died more than 3 times ( if lives is less than 0 -> Game Over)
  Player.prototype.life = function(life, lives) {
      if (life === false && lives > 0) {
          config.lives--; //
          hitbox.life = true; //Reborn
          this.y = CONSTANTS.STARTPOSITION; //Restart
          console.log("Yayyyy,", life);
          console.log("Lives", lives);
          this.state(config.lives);
      } else {
          this.gameOver();
      }
  };

  //Restart the player on the grass when Game Over
  //TODO Show Game over screen
  //TODO Implement Start Again Button
  Player.prototype.gameOver = function() {
      this.state(config.lives);
      config.lives = "Game Over";
      this.y = CONSTANTS.STARTPOSITION; //Restart
      console.log("Game Over");
  };

  // Render Player on the screen
  Player.prototype.render = function() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };

  // Detect any key pressed. and move the player 40px each time.
  Player.prototype.handleInput = function(key) {
    var step = CONSTANTS.STEP_DISTANCE;
    if(this.y < ctx.canvas.height && key === "up") {
      this.y -= step;
    } else if(this.y < CONSTANTS.STARTPOSITION && key === "down"){
      this.y += step;
    } else if(this.x > ctx.canvas.scrollLeft && key === "left"){
      this.x -= step;
    } else if(this.x < ctx.canvas.width - CONSTANTS.PLAYERWIDTH && key === "right"){
      this.x += step;
    } else {
       window.console.log("Where do you thinkg you're going?");
    }
  };

  // Generates my enemies and push them in the Enemy Array outside of this closure
  for (var i = 0; i < config.enemyNumber; i++) {
      var enemy = new Enemy(enemyX, enemyY, enemySpeed);
      var enemyY = enemy.randomAligment();
      // sets X coordinate randomly
      var enemyX = CONSTANTS.ENEMYSTART;
      // sets speed to a base of 50 and then randomizes each enemy
      var enemySpeed = getRandomInt(CONSTANTS.MINSPEED, CONSTANTS.MAXSPEED);
      // push enemies into allEnemies array, 4 enemies total
      allEnemies.push(enemy);
  }

  // Initialize player
  // var player is initialised at line 8.
  player = new Player(config.playerX, 0);

  // Player.handleInput() method. You don't need to modify this.
  document.addEventListener('keyup', function(e) {
      var allowedKeys = {
          37: 'left',
          38: 'up',
          39: 'right',
          40: 'down'
      };
      player.handleInput(allowedKeys[e.keyCode]);
  });
})(window);
