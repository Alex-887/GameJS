// Create the canvas
//var canvas = document.createElement("canvas");
//var ctx = canvas.getContext("2d");

let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext("2d");

//canvas.width = 1920;
//canvas.height = 1080;


document.body.appendChild(canvas);


// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "Ressources/Images/bg.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
}
heroImage.src = "Ressources/Images/Trump-removebg-preview.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
}
monsterImage.src = "Ressources/Images/Mexican-removebg-preview.png";

let brickReady = false;
let brickImage = new Image();
brickImage.onload = function(){
    brickReady = true;
}
brickImage.src = "Ressources/Images/Brick.png";
let bricksCount = 0;
let spawnBrick = true;

let heroHealth = document.getElementById("health");

// Game objects
let hero = {
	speed: 512, // movement in pixels per second
    size: 30
}

let brick = {

}

let monster = {
    lifeMexican: 2,
    speed: 128
}

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

    brick.x = 32 + (Math.random() * (canvas.width - 64));
	brick.y = 32 + (Math.random() * (canvas.height - 64));

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};



// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
        if(hero.y < 0){
            hero.y = 0;
        }
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
        if (hero.y + hero.size > ctx.canvas.height){
            //hero.y -= 50;
            hero.y = ctx.canvas.height + hero.size;
        }
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
        if (hero.x < 0){
            hero.x = 0;
        }
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
        if (hero.x + hero.size > ctx.canvas.width){
            hero.x = 1850;
        }
	}


	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {

        heroHealth.value -= 1;
        if(heroHealth.value <= 0)
            {
            alert("You are dead !")
            }
	}


    //Brick count
    if (
		hero.x <= (brick.x + 32)
		&& brick.x <= (hero.x + 32)
		&& hero.y <= (brick.y + 32)
		&& brick.y <= (hero.y + 32)
	) {

        bricksCount++;
        resetBrick();

	}


};



let mexicans = [];

function makeMexican(){

    //let mexicanPos = Math.floor(Math.random() * 32) + 1;

    let mexicanXpos = 32 + (Math.random() * (canvas.width - 64));
    let mexicanYpos = 32 + (Math.random() * (canvas.height - 64));
    let mexicanXspeed = 128;
    let mexicanYspeed = 128;

    let mexican = {
        mexicanXpos: mexicanXpos,
        mexicanYpos: mexicanYpos,
        mexicanXspeed: mexicanXspeed,
        mexicanYspeed: mexicanYspeed,
        lifeMexican: 2
    };

    mexicans.push(mexican);
}


function drawMexicans(){

    mexicans.forEach(function(mexican, i){


            if(monsterReady){
                ctx.drawImage(monsterImage, mexican.mexicanXpos, mexican.mexicanYpos);

            }

    });

}

function mexicanMove(modifier){

    mexicans.forEach(function(mexican){

         // monster.x=monster.x - 1;
    var diffx = Math.floor(hero.x - mexican.mexicanXpos);
    var diffy = Math.floor(hero.y - mexican.mexicanYpos);

    //Distance min between trump and mexicans
    let gap = 20;


    if (diffy < -gap) { // Player holding up
		mexican.mexicanYpos -= mexican.mexicanYspeed * modifier;
	}
	if (diffy > gap) { // Player holding down
		mexican.mexicanYpos += mexican.mexicanYspeed * modifier;
	}
	if (diffx < -gap) { // Player holding left
		mexican.mexicanXpos -= mexican.mexicanXspeed * modifier;
	}
	if (diffx > gap) { // Player holding right
		mexican.mexicanXpos += mexican.mexicanXspeed * modifier;
	}

        //Are they touching
        if (
		hero.x <= (mexican.mexicanXpos + 32)
		&& mexican.mexicanXpos <= (hero.x + 32)
		&& hero.y <= (mexican.mexicanYpos + 32)
		&& mexican.mexicanYpos <= (hero.y + 32)
	) {
        //Decrease life of Trump
        heroHealth.value -= 1;
        if(heroHealth.value <= 0)
            {
            alert("You are dead !")
            }
	}

    });

}


function resetBrick(){

    brick.x = 32 + (Math.random() * (canvas.width - 64));
	brick.y = 32 + (Math.random() * (canvas.height - 64));

}

//Move mexicans
var redrawMexicans = function(modifier){

   // monster.x=monster.x - 1;
    var diffx = Math.floor(hero.x - monster.x);
    var diffy = Math.floor(hero.y - monster.y);

    //Distance min between trump and mexicans
    let gap = 20;




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


}

// Draw everything
var render = function () {



	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

    if (brickReady) {
		ctx.drawImage(brickImage, brick.x, brick.y);
	}

	// Score
	//ctx.fillStyle = "rgb(250, 250, 250)";
	//ctx.font = "24px Helvetica";
	//ctx.textAlign = "left";
	//ctx.textBaseline = "top";
	//ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
    document.getElementById("bricks").innerHTML = bricksCount;
};


let totalMexicans = 0;
let startingPos = true;

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;




    render();

    if(startingPos){
        while(totalMexicans < 5){
            makeMexican();
            totalMexicans += 1;
        }
        startingPos = false;
    }

    then = now;

    update(delta / 1000);

    mexicanMove(delta/1000);

    setInterval(drawMexicans(), 40);



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
