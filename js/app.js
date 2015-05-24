var PLAYER_START_X = 200; // X where the player will start
var PLAYER_START_Y = 400; // Y where the player will start
var FIRST_ROW = 60; // Y position where the first enemy will start
var CELL_SIZE = 83;// height of a row in pixels.  this was taken from the engine code
//var COL_WIDTH = 101; // width of the column as defined in the engine  (not currently used )
var STEP_SIZE = 1; // sets how big of a step the player will take each keystroke
var BOY = 'images/char-boy.png';
var GIRL = 'images/char-princess-girl.png';


//returns a random number between min and max
function RandomInt(min, max) {
    return Math.floor(Math.random() * (max+1 - min)) + min;
}

function PlayerBugCollide (p, e) {
    /* check to see if there is an ovelap of player and the enemy */
    if (((p.x <= (e.x + e.wide)) && ((p.x + p.wide) >= e.x)) && (((p.y + p.head) <= e.y + e.tall) && ((p.y + p.tall) >= e.y))) {
        return true;
    } else {
        return false;
    }
}

function GemBugCollide (g, e) {
    /* check to see if there is an overlap of the gem and enemy */
    if (((g.x <= (e.x + e.wide)) && ((g.x + g.wide) >= e.x)) && ((g.y <= e.y + e.tall) && ((g.y + g.tall) >= e.y))) {
        return true;
    } else {
        return false;
    }
}

function PrintScore (p) {
    var canvas = document.querySelector('canvas');
    ctx.fillStyle = "white";
    ctx.fillRect(0,-20,510,70);  // clear out the previous score
    ctx.font = "36pt Impact";
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.textAlign = "left";
    ctx.strokeText("Boys: " + p.score[0],0,40);
    ctx.textAlign = "right";
    ctx.strokeText("Girls: " + p.score[1],canvas.width,40);
}


/*places the player back at the start position
resets the gems on the bugs
switches the gener of the player */
function Reset() {
    // sex change 
    if (player.sex == 'female') {
        player.sprite = BOY;
        player.sex = 'male';
    } else {
        player.sprite = GIRL;
        player.sex = 'female';
    };
    // reposition player to start
    player.x = PLAYER_START_X;   
    player.y = PLAYER_START_Y;
}


// Enemies our player must avoid
var Enemy = function(x, y){
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.x = x;
    this.y = y;
    this.wide = 78; //default width for an enemy
    this.tall = 80; //default height for an enemy
    this.greenCount = 0; // start out with no green gems
    this.blackCount = 0; // start out with no black gems
    this.direction = 1; // by default enemies ony go right unless their subclass allows for changing it
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // Reset the bugs that have drifted off of the screen either to the left or the right
    if (this.x > 700) { // the right direction gets reset to the left
        this.x = -100;
    };
    if (this.x < -100) { // the left direction bug gets reset to the right
        this.x = 700;
    };    

    // movement up and down occur when the bugs have a black gem count
    if (this.blackCount > 0) {
        // calculate the amount of stagger up and down based on the count of black gems
        this.y = this.y + RandomInt(this.blackCount * -1, this.blackCount); 

        // keep the bug within the playing area
        if (this.y < FIRST_ROW) {
            this.y = FIRST_ROW;
        };  // if it staggers out of the lanes then put it back in bounds
        if (this.y > FIRST_ROW + (CELL_SIZE * 2)) {
            this.y = FIRST_ROW + CELL_SIZE * 2;
        };
    };

    //movement left and right 
    this.x = this.x + (this.direction * dt * 100 * (this.greenCount + 1)); // the direction -1 will move left, greenCount moves faster, dt sets speed same on all CPUs

    // check for collisions...

    //  ------  bug hits a green gem ------
    /* add one to the number of green gems that the bug has collected 
    change the picture of the bug to a little more green 
    remove the black gem from the playing area */
 
    if (greenGem.hide > 0) {  // if the gem is hidden then dont check for a collision and tick away the hide time
        greenGem.hide--;
    } else {
        if (GemBugCollide(greenGem, this)) {
            if (this.greenCount < 5) {
                this.greenCount++; // increment the green count if less than 5
            }; 
            greenGem.move();//move the gem
            
            // assign the bug sprite based on the direction, how many green gems and if they have a duff on their back  
            // TODO: this would be cleaner if you could augment the sprite with the color, duff, diretion rather than replace with a whole picture
            if (this.greenCount === 1 ){
                if (this.direction === -1) {
                    this.sprite = 'images/enemy-bug-left-wild1.png';
                } else {
                    this.sprite = 'images/enemy-bug-wild1.png';
                };
            };
            if (this.greenCount === 2 ){
                if (this.direction === -1) {
                    this.sprite = 'images/enemy-bug-left-wild2.png';
                } else {
                    this.sprite = 'images/enemy-bug-wild2.png';
                };
            };
            if (this.greenCount === 3 ){
                if (this.direction === -1) {
                    this.sprite = 'images/enemy-bug-left-wild3.png';
                } else {
                    this.sprite = 'images/enemy-bug-wild3.png';
                };
            };
        };
    };    
 
    //  ------  bug hits a black gem ------
    /* add one to the number of black gems that the bugs collected
     move the black gem to antoher area of the screen     
     remove the black gem from the playing area */

    if (blackGem.hide > 0) { //  if the black gem is hidden then do not check for the collision and tick away the hide time
        blackGem.hide--;
    } else  {
        if (GemBugCollide(blackGem, this)) {
            if (this.blackCount < 5) {
                this.blackCount++;  // increment the black count if less than 5
            };
            blackGem.move(); //move the gem
        };
    };
    // add the duff if the black gem count is greater than one
    if (this.blackCount >= 1) {
        switch (this.sprite) {
            case "images/enemy-bug.png":
                this.sprite = "images/enemy-bug-duff.png";
            break;
            case "images/enemy-bug-left.png":
                this.sprite = "images/enemy-bug-left-duff.png";
            break;
            case "images/enemy-bug-wild1.png":
                this.sprite = "images/enemy-bug-wild1-duff.png";
            break;
            case "images/enemy-bug-wild2.png":
                this.sprite = "images/enemy-bug-wild2-duff.png";
            break;
            case "images/enemy-bug-wild3.png":
                this.sprite = "images/enemy-bug-wild3-duff.png";
            break;
            case "images/enemy-bug-left-wild1.png":
                this.sprite = "images/enemy-bug-left-wild1-duff.png";
            break;
            case "images/enemy-bug-left-wild2.png":
                this.sprite = "images/enemy-bug-left-wild2-duff.png";
            break;
            case "images/enemy-bug-left-wild3.png":
                this.sprite = "images/enemy-bug-left-wild3-duff.png";
            break;
        };
    };

    //  ------  Player hits a bug  ------
    /*If there is a collision then put player back to begining position.
    this if statement basically checks to see if rectangle defined as the enemy's body overlaps with the rectangle that defines the player (minus the head).
    the width and height of the enemy and the player is stored in the wide and tall.  The head height of the player is stored in head. */
    if (PlayerBugCollide (player, this)) {
        Reset();
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// ladyBug is a type of an Ememy that can go left or right
var ladyBug = function(x, y, direction) {
    Enemy.call(this,x, y);
    this.wide = 78; // a lady bug is 78 pixels wide (same as default)
    this.tall = 80; // lady bug is 80 pixels tall (same as the default)
    if (direction == "left") {
        this.sprite = 'images/enemy-bug-left.png';
        this.direction = -1;
    } else { // default is to the right
        this.sprite = 'images/enemy-bug.png';
        this.direction = 1;
    };
};
ladyBug.prototype = Object.create(Enemy.prototype);
ladyBug.prototype.constructor = ladyBug;


// Now write your own player class
var Player = function(sex) {
    if (sex == 'female') {
        this.sprite = 'images/char-princess-girl.png';
        this.sex = 'female';
    } else {  // default to the boy
        this.sprite = 'images/char-boy.png';
        this.sex = 'male';
    };
    this.x = PLAYER_START_X;   // This sets the starting location for the player    
    this.y = PLAYER_START_Y;
    this.head = 35; // head size of player - this part can poke into enemy without collision
    this.tall = 60; // how tall the payer is
    this.wide = 70; // how wide the player is
    this.score = [0,0]; // boys score, girls score
};

// This class requires an update(), 
Player.prototype.update = function() {
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    PrintScore(this);
}

// Player.handleInput() method. You don't need to modify this.
Player.prototype.handleInput = function(key) { 
    switch(key) {
        case 'left': //only move left if there is room
            this.x = this.x - (CELL_SIZE * STEP_SIZE);  // the step size is set at the constant section and a % of the row height
            if (this.x < -1) {
                this.x = -1;
            };
        break;
        case 'up':  // move up only if the feet are below the first row
            if (this.y + this.tall > FIRST_ROW) { 
                this.y = this.y - (CELL_SIZE * STEP_SIZE);
            } else { // if the player reached the top then score a point for either Boy or Girl then print the score
                if (player.sex == "female") {
                    player.score[1]++;
                    console.log("FEMALE point");
                } else {
                    player.score[0]++;
                    console.log("MALE point");
                };   
                Reset(); // reset the screen
            };
            break;
        case 'right':
            this.x = this.x + (CELL_SIZE*STEP_SIZE);
            if (this.x > 407) {  // only move right if there is still room
                this.x = 407;
            };
           break;
        case 'down': // move down only if player is above inital start 
            if (this.y < PLAYER_START_Y) {
                this.y = this.y + (CELL_SIZE*STEP_SIZE);
            };
        default:
            break;
    };   
}

// Gem object creation.  Black gems make bugs go up and down; Green gems make bugs go faster
var Gem = function (x, y, tall, wide, image) {
    this.x = x;
    this.y = y;
    this.tall = tall;
    this.wide = wide;
    this.sprite = image;
    this.hide = 1000; // will be used for the number of renders to hide
};

Gem.prototype.move = function (){
    this.x = RandomInt(0,6) * this.wide;
    this.y = FIRST_ROW + RandomInt(1,3) * this.tall;
    this.hide = 1000; // after moveing hide the gem for this many renders
}

Gem.prototype.render = function (){
    if (this.hide === 0) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
}

// create green and black gems
var greenGem = new Gem(CELL_SIZE * 1.5, FIRST_ROW * 2, 50, 50,'images/Gem Green.png');
var blackGem = new Gem(CELL_SIZE * 2.75, FIRST_ROW * 2 + CELL_SIZE,20,20,'images/Gem Duff.png');

// instantiate the lady bugs
var lb1 = new ladyBug (100, FIRST_ROW);
var lb2 = new ladyBug (-100, FIRST_ROW); // first row goes to the right
var lb3 = new ladyBug (700, FIRST_ROW + CELL_SIZE,"left"); //second row goes to the left
var lb4 = new ladyBug (-50, FIRST_ROW + (2 * CELL_SIZE)); //third row goes to the right

// Place all enemy objects in an array called allEnemies
var allEnemies = [lb1, lb2, lb3, lb4];

// Place the player object in a variable called player be default the first player will be boy
var player = new Player();

/* TODO: change th logic so there are physically two player objects, one for the male and one for the female.
but then the render for the play will need to be changed to only paint the active player 
var girlPlayer = new Player('female') */

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