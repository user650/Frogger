var PLAYER_START_X = 200; // X where the player will start
var PLAYER_START_Y = 400; // Y where the player will start
var FIRST_ROW = 60; // Y position where the first enemy will start
var ROW_HEIGHT = 82;// height of a row in pixels. since this game uses a square grid this is also used as the column 
var STEP_SIZE = .5; // sets how big of a step the player will take each keystroke
var BOY = 'images/char-boy.png';
var GIRL = 'images/char-princess-girl.png';


// Enemies our player must avoid
var Enemy = function(x, y,direction){
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.x = x;
    this.y = y;
    this.wide = 78; //default width for an enemy
    this.tall = 80; //default height for an enemy
    this.direction = direction; // 1 moves to the right -1 moves to the left
    this.drinks = 0; //everyone starts out sober
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // If enemy goes off the of the game area to the right or left then rest them 
    if (this.x > 700) { // the right direction gets rest on the left
        this.x = -100};

    // the left direction bug gets reset to the left and put him back in his lane becasue he may have staggered out if he was drinking
    if ((this.direction === -1) && (this.x < -100)) {  
        this.x = 700; // move him back to the right
        this.y = ROW_HEIGHT*2; // start him in the middle each time

        // The left flowing bug will take an energy drink every time it goes off to the left.  Cut him off after a 12 pack
        if (this.drinks <= 11) {this.drinks = this.drinks +1};  
        if (this.drinks === 1) {this.sprite = 'images/enemy-bug-left-wild1.png'}; // starting to get a little amped
        if (this.drinks === 3) {this.sprite = 'images/enemy-bug-left-wild2.png'}; // a little more
        if (this.drinks === 5) {this.sprite = 'images/enemy-bug-left-wild3.png'}; // all hyped up
    };
    if (this.drinks > 0) {
        var max = this.drinks;
        var min = (max*-1);
        var delta = this.y;
        
        // the bug will wiggle out of his lane in porportion to the number of drinks.  
        //note that added +1 to max to distribute the random number correctly between min and max
        this.y = this.y + (Math.floor(Math.random() * ((max+1) - min) + min)); 

        if (this.y < FIRST_ROW) {this.y = FIRST_ROW};  // if it staggers out of the lanes then put it back in bounds
        if (this.y > FIRST_ROW + (ROW_HEIGHT*2)) {this.y = FIRST_ROW + ROW_HEIGHT*2};
    }
    this.x = this.x + (this.direction*dt*100); // the direction == -1 will force the bug to move to the right.  use the dt to keep the movement the same on all CPUs

/* if there is a collision then put player back to bigging position.
     this if statement basically checks to see if rectangle defined as the enemy's body overlaps with the rectangle that defines the player (minus the head).
     the width and height of the enemy and the player is stored in the wide and tall.  The head height of the player is stored in head. */
    if (((player.x <= (this.x + this.wide)) && ((player.x + player.wide) >= this.x)) && (((player.y+player.head)<= this.y+this.tall) && ((player.y+player.tall)>=this.y))){
            
            // collision detected...
            if (player.sprite == GIRL) {
                player.sprite = BOY;
            } else {
                player.sprite = GIRL;
            };
            player.x = PLAYER_START_X;   
            player.y = PLAYER_START_Y;
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// ladyBug is an Enemy object
var ladyBug = function(x, y, direction) {
    Enemy.call(this,x, y, direction);
    this.wide = 78; // a lady bug is 78 pixels wide
    this.tall = 80; // lady bug is 80 pixels tall
    if (direction == -1) {
        this.sprite = 'images/enemy-bug-left.png';
    }
    else {
        this.sprite = 'images/enemy-bug.png';
    }
 };
ladyBug.prototype = Object.create(Enemy.prototype);
ladyBug.prototype.constructor = ladyBug;


// Now write your own player class
var Player = function(sex) {
    if (sex == 'F') {
        this.sprite = 'images/char-princess-girl.png';
    }
    else {  // default to the boy
        this.sprite = 'images/char-boy.png';
    }
    this.x = PLAYER_START_X;   // This sets the starting location for the player    
    this.y = PLAYER_START_Y;
    this.head = 35; // head size of player - this part can poke into enemy without collision
    this.tall = 60; // how tall the payer is
    this.wide = 70; // how wide the player is
};

// This class requires an update(), render() and
Player.prototype.update = function() {
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player.handleInput() method. You don't need to modify this.
Player.prototype.handleInput = function(key) { 
    switch(key) {
        case 'left': //only move left if there is room
            this.x = this.x - (ROW_HEIGHT*STEP_SIZE);  // the step size is set at the constant section and a % of the row height
          if (this.x < -1) {
                this.x = -1;
            };
            break;
        case 'up':  // move up only if the feet are below the first row
            if (this.y + this.tall > FIRST_ROW) { 
                this.y = this.y - (ROW_HEIGHT*STEP_SIZE);
            } else {
                    var canvas = document.querySelector('canvas');
                    var ctx = canvas.getContext("2d");
                        //Scott Stubbs added this wonderful code 
                    ctx.font = "36pt Impact";
                    ctx.textAlign = "right";
                    ctx.fillStyle = "white";
                    ctx.strokeStyle = "black";
                    ctx.lineWidth = 3;
                    ctx.textAlign = "left";
                    ctx.strokeText("Boys: ",0,40);
                    ctx.textAlign = "right";
                    ctx.strokeText("Girls: ",canvas.width,40);
            }

            break;
        case 'right':
            this.x = this.x + (ROW_HEIGHT*STEP_SIZE);
            if (this.x > 407) {  // only move right if there is still room
                this.x = 407;
            };
           break;
        case 'down': // move down only if player is above inital start 
            if (this.y < PLAYER_START_Y) {
                this.y = this.y + (ROW_HEIGHT*STEP_SIZE);
            };
        default:
            break;
    }   
}

// instantiate the lady bugs
var lb1 = new ladyBug (100, FIRST_ROW,1);
var lb2 = new ladyBug (-100, FIRST_ROW,1); // first row goes to the right
var lb3 = new ladyBug (700, FIRST_ROW + ROW_HEIGHT,-1); //second row goes to the left
var lb4 = new ladyBug (-50, FIRST_ROW + (2*ROW_HEIGHT),1); //third row goes to the right

// Place all enemy objects in an array called allEnemies
var allEnemies = [lb1, lb2, lb3, lb4];

// Place the player object in a variable called player
var player = new Player("M");

// This listens for key presses and sends the keys to your
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});