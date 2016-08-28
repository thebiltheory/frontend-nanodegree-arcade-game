
//------- Config Function

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) - min);
}

//----- Game Config
var config = {
        playerX: getRandomInt(30,780),
        minSpeed: 50,
        maxSpeed: 300
};

// -------- ENEMY

//Class of our Enemies

var Enemy = function (x, y, speed) {
    this.sprite = "images/enemy-bug.png";
    this.y = y;
    this.x = x;
    this.speed = speed;
};

// Update the enemy's position, required method for game

// Parameter: dt, a time delta between ticks

Enemy.prototype.update = function (dt) {
      this.x += this.speed * dt;
      if(this.x > 810){
        this.x = -120;
        // Call Function Alignment that gives a new Y axis random position.
        this.y = randomAligment();
      }
};

// Draw the enemy on the screen, required method for game

Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// --------- PLAYER

// Now write your own player class

// This class requires an update(), render() and

// a handleInput() method.

var Player = function (x, y) {
    this.sprite = "images/char-boy.png";
    this.x = x;
    this.y = y;
    this.score = 0;
};

Player.prototype.update = function () {
  //Player reach water
  if(this.y <= 0) {
    this.score += 10;
    this.y = 404;
  }
};

Player.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (key) {
  switch (key) {
    case 'up':
      this.y -= 40;
      break;

    case 'down':
      this.y += 40;
      break;

    case 'left':
      this.x -= 40;
      break;

    case 'right':
      this.x += 40;
      break;

    default:
      break;
  }
};

// Now instantiate your objects.

// Place all enemy objects in an array called allEnemies

var allEnemies = [];

// sets Y coordinate for each enemy to 55, 145, and 225 by using incrementer


// This function pic a random property of Object EnemyAlign

// in order to contain and distribute the enemies in the paved block.
function alignment(positions) {
  var position = Object.keys(positions);
  return positions[position[position.length * Math.random() << 0]];
}

function randomAligment() {
  var enemyAlign = {
    top : 55,
    middle : 145,
    bottom : 225
  };
  return alignment(enemyAlign);
}

  for (var i = 0; i < 4; i++) {
    var enemy = new Enemy(enemyX, enemyY, enemySpeed);
    var enemyY = randomAligment();
    // sets X coordinate randomly
    var enemyX = -120;
    // sets speed to a base of 50 and then randomizes each enemy
    var enemySpeed = getRandomInt(config.minSpeed, config.maxSpeed);
    // push enemies into allEnemies array, 4 enemies total
    allEnemies.push(enemy);
  }


// Place the player object in a variable called player

//The Random number function gives the player a random position on the X Axis
var player = new Player(config.playerX, 0);


// This listens for key presses and sends the keys to your

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
