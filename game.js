"use strict";
// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1920;
canvas.height = 1080;

document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "Ressources/Images/bg.png";
<<<<<<< HEAD
//hes
// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "Ressources/Images/Trump.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.width=32
monsterImage.height =32
monsterImage.src = "Ressources/Images/Mexican.png";

// Game objects
var hero = {
	speed: 512 // movement in pixels per second
};
var monster = {
    speed: 128
};
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {

	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;



        // Throw the monster somewhere on the screen randomly
         monster.x = 32 + (Math.random() * (canvas.width - 64));
	     monster.y = 32 + (Math.random() * (canvas.height - 64));



};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}

	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
        mexicansNumber--;
        //alert("You are hit !")
		//reset();
	}
};

//Move mexicans
var redrawMexicans = function(modifier){

   // monster.x=monster.x - 1;
    var diffx = Math.floor(hero.x - monster.x);
    var diffy = Math.floor(hero.y - monster.y);

    //Distance min between trump and mexicans
    var gap = 20;


    //Set movement of the ennemies
    if (diffy < -gap) { // Player holding up
		monster.y -= monster.speed * modifier;
	}
	if (diffy > gap) { // Player holding down
		monster.y += monster.speed * modifier;
	}
	if (diffx < -gap) { // Player holding left
		monster.x -= monster.speed * modifier;
	}
	if (diffx > gap) { // Player holding right
		monster.x += monster.speed * modifier;
	}


    if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

}


// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}



    let mexicansNumber = 0
    while(mexicansNumber < 5){
        redrawMexicans();
    mexicansNumber++;
    }


	// Score
	ctx.fillStyle = "rgb(250, 150, 150)";
	ctx.font = "24px Helvetica";
	//ctx.textAlign = "left";
	//ctx.textBaseline = "top";
	ctx.fillText("Mexicans caught: " + monstersCaught, 0, 200);



};

// The main game loop
var main = function () {
	var now = Date.now();
    //Stabilize the speed of entities
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

    setInterval(redrawMexicans(delta / 1000), 1000)

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
