"use strict";
//------- Config Function
// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) - min);
}

// function write (text, x, y) {
//   ctx.font = "30px arcadeclassic";
//   ctx.fillStyle = "black";
//   ctx.fillText(text, x, y);
// };

//----- Game Config
//TODO: Refactor config in external file
var config = {
    playerX: getRandomInt(30, 780),
    startPosition: 404,
    minSpeed: 300,
    maxSpeed: 900,
    enemyExit: 810, // Exit point of the enemy
    enemyStart: -120, // Starting point of the enemy
    initScore: 0,
    playerHeight: 50,
    playerWidth: 60,
    enemyHeight: 71,
    enemyWidth: 101,
    enemyNumber: 20, // Number of enemies
    lives: 3 //Lives of the player
};

var hitbox = {
    enemyX: null,
    enemyY: null,
    playerX: null,
    playerY: null,
    life: true
};

// -------- ENEMY



//Class of our Enemies

var Enemy = function(x, y, speed) {
    this.sprite = "images/enemy-bug.png";
    this.y = y;
    this.x = x;
    this.height = config.enemyHeight;
    this.width = config.enemyWidth;
    this.speed = speed;
};

// Update the enemy's position, required method for game

// Parameter: dt, a time delta between ticks

Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;
    if (this.x > config.enemyExit) {
        this.x = config.enemyStart;
        // Call Function Alignment that gives a new Y axis random position.
        this.y = randomAligment();
    }

    hitbox.enemyX = this.x;
    hitbox.enemyY = this.y;

    // Collision Detection
    if (hitbox.playerX < hitbox.enemyX + config.enemyWidth && hitbox.playerX + config.playerWidth > hitbox.enemyX && hitbox.playerY < hitbox.enemyY + config.enemyHeight && config.playerHeight + hitbox.playerX > hitbox.enemyY) {
        console.log("Diiiiiiiiiiiieeeee");
        hitbox.life = false;
        // Fires player lifes when collision is detected
        player.life(hitbox.life, config.lives);
    }
    // console.log("Player: ", this.y, this.x, " | Enemy: ", hitbox.enemyY, hitbox.enemyX);


};

// Draw the enemy on the screen, required method for game

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};



// --------- PLAYER

// Now write your own player class

// This class requires an update(), render() and
// a handleInput() method.


var Player = function(x, y) {
    this.sprite = "images/char-boy.png";
    this.x = x;
    this.y = y;
    this.lives = config.lives;
    this.height = config.playerHeight;
    this.width = config.playerWidth;
    this.score = config.initScore;
};

Player.prototype.update = function() {
    //Player reach water
    if (this.y <= 0) {
        this.score += 10;
        this.y = 404;
    }
    hitbox.playerX = this.x;
    hitbox.playerY = this.y;
};

Player.prototype.state = function(lives) {

};

Player.prototype.life = function(life, lives) {
    if (life === false && lives > 0) {
        config.lives--; //
        hitbox.life = true; //Reborn
        this.y = config.startPosition; //Restart
        console.log("Yayyyy,", life);
        console.log("Lives", lives);
        player.state(config.lives);
    } else {
        player.gameOver();
    }
};

Player.prototype.gameOver = function() {
    player.state(config.lives);
    config.lives = "Game Over";
    this.y = config.startPosition; //Restart
    console.log("Game Over");
    // alert("Game Over");
};


Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
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
        top: 55,
        middle: 145,
        bottom: 225
    };
    return alignment(enemyAlign);
}

for (var i = 0; i < config.enemyNumber; i++) {
    var enemy = new Enemy(enemyX, enemyY, enemySpeed);
    var enemyY = randomAligment();
    // sets X coordinate randomly
    var enemyX = config.enemyStart;
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
