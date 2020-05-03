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
monsterImage.src = "Ressources/Images/Mexican.png";


let heroHealth = document.getElementById("health");

// Game objects
var hero = {
	speed: 512 // movement in pixels per second
};
var monster = {
    speed: 128
};

var monstersCaught = 0;

var lifeMonster = 5;

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



    //if the hero attacks by pressing f (fight)

            //on the left
            if(70 in keysDown && 37 in keysDown )
            {
                //if he touches a naughty mexicain on the left
                if (hero.x <= (monster.x - 40))
                {
                    lifeMonster -=1;

                    if(lifeMonster<=0)
                    {
                        //ctx.rotate(-90*Math.PI/180);

                        // Throw the monster somewhere on the screen randomly
	                   monster.x = 32 + (Math.random() * (canvas.width - 64));
                        monster.y = 32 + (Math.random() * (canvas.height - 64));
                    }
                }
            }

            //on the right
            if(70 in keysDown && 39 in keysDown )
            {

                //if he touches a naughty mexicain on the right
                if (hero.x <= (monster.x + 40))
                {

                 lifeMonster -=1;

                       if(lifeMonster<=0)
                        {
                          //   ctx.rotate(-90*Math.PI/180);
                            // Throw the monster somewhere on the screen randomly
	                       monster.x = 32 + (Math.random() * (canvas.width - 64));
	                       monster.y = 32 + (Math.random() * (canvas.height - 64));
                        }
                }
            }



	// When the mexican touches Trump
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
	//	++monstersCaught;
		//reset();

        heroHealth.value -= 1;
        if(heroHealth.value <= 0)
            {
            alert("You are dead !")
            }
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

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	//ctx.textAlign = "left";
	//ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

    setInterval(redrawMexicans(delta / 1000), 1000);


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
