// Create the canvas

let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext("2d");
let buffer = document.getElementById("gameScreen").getContext("2d");


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

// mexican image
var mexicanReady = false;
var mexicanImage = new Image();
mexicanImage.onload = function () {
	mexicanReady = true;
}
mexicanImage.src = "Ressources/Images/Mexican-removebg-preview.png";

// Brick image
let brickReady = false;
let brickImage = new Image();
brickImage.onload = function(){
    brickReady = true;
}
brickImage.src = "Ressources/Images/Brick.png";


// Bullet image
let bulletReady = false;
let bulletImage = new Image();
bulletImage.onload = function(){
    bulletReady = true;
}
bulletImage.src = "Ressources/Images/star.png";



let bricksCount = 0;
let spawnBrick = true;

let heroHealth = document.getElementById("health");


let bullets = [];


// Game objects *******************************************************v


let hero = {
	speed: 512, // movement in pixels per second
    size: 30,
    x: canvas.width / 2,
	y: canvas.height / 2,
    angle: 0,
    heroHealth: heroHealth
}


class Bullet{
    constructor(angle) {
        this.visible = true;
        this.x = hero.x;
        this.y = hero.y;
        this.angle = angle;
        this.height = 6;
        this.width = 6;
        this.speed = 5;
        this.velX = 0;
        this.velY = 0;
    }
    Update(){
        let radians = this.angle / Math.PI * 180;
        this.x -= Math.cos(radians) * this.speed;
        this.y -= Math.sin(radians) * this.speed;
    }
    Draw(){
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
}

class mexican{
    constructor() {
        this.x= 32 + (Math.random() * (canvas.width - 64));
        this.y= 32 + (Math.random() * (canvas.width - 64));
        this.speed= 18;
        this.life= 2 ;
        this.dead = false;
    }
}

let brick = {

}

//camera
let viewport = {

    screen  : [0,0],
    startTile :[0,0],
    endTile :[0,0],
    offset : [0,0],
    update : function(px, py){
        this.offset[0] = Math.floor((this.screen[0]/2) - px);
        this.offset[1] = Math.floor((this.screen[1]/2) - py);

        let tile = [
          Math.floor(px/32),
          Math.floor(py/32)
        ];

        this.startTile[0] = tile[0] - 1 - Math.ceil((this.screen[0]/2) / 32);
        this.startTile[1] = tile[1] - 1 - Math.ceil((this.screen[1]/2) / 32);

        if(this.startTile[0] < 0) {this.startTile[0] = 0}
        if(this.startTile[1] < 0) {this.startTile[1] = 0}

        this.endTile[0] = tile[0] + 1 + Math.ceil((this.screen[0]/2) / 32);
        this.endTile[1] = tile[1] + 1 + Math.ceil((this.screen[1]/2) / 32);

        if(this.endTile[0] >= 24) {this.endTile[0] = 24 - 1;}
        if(this.endTile[1] >= 24) {this.endTile[1] = 24 - 1;}
    }

};


// Game objects *******************************************************


//Generate the map ****************************************************

function drawMap() { "use strict";

  /* The display handles everything to do with drawing graphics and resizing the
  screen. The world holds the map and its dimensions. */
  var display, world;

  display = {

    /* We draw the tiles to the buffer in "world" coordinates or unscaled coordinates.
    All scaling is handled by drawImage when we draw the buffer to the display canvas. */
    buffer:document.getElementById("gameScreen").getContext("2d"),
    /* Scaling takes place on the display canvas. This is its drawing context. The
    height_width_ratio is used in scaling the buffer to the canvas. */
    context:document.getElementById("gameScreen").getContext("2d"),
    /* The height width ratio is the height to width ratio of the tile map. It is
    used to size the display canvas to match the aspect ratio of the game world. */
    height_width_ratio:undefined,

    /* The tile_sheet object holds the tile sheet graphic as well as its dimensions. */
    tile_sheet: {

      image:new Image(),// The actual graphic will be loaded into this.

      columns:32,
      tile_height:32,
      tile_width:32

    },

    /* This function draws the tile graphics from the tile_sheet.image to the buffer
    one by one according to the world.map. It then draws the buffer to the display
    canvas and takes care of scaling the buffer image up to the display canvas size. */
    render:function() {

        context.fillRect(0, 0, document.documentElement.clientHeight, document.documentElement.clientWidth);

      /* Here we loop through the tile map. */
      for (let index = world.map.length - 1; index > -1; -- index) {

        /* We get the value of each tile in the map which corresponds to the tile
        graphic index in the tile_sheet.image. */
        var value = world.map[index];

        /* This is the x and y location at which to cut the tile image out of the
        tile_sheet.image. */
        var source_x = (value % this.tile_sheet.columns) * this.tile_sheet.tile_width;
        var source_y = Math.floor(value / this.tile_sheet.columns) * this.tile_sheet.tile_height;

        /* This is the x and y location at which to draw the tile image we are cutting
        from the tile_sheet.image to the buffer canvas. */
        var destination_x = (index % world.columns) * this.tile_sheet.tile_width;
        var destination_y = Math.floor(index / world.columns) * this.tile_sheet.tile_height;

        /* Draw the tile image to the buffer. The width and height of the tile is taken from the tile_sheet object. */
        this.buffer.drawImage(this.tile_sheet.image, source_x, source_y, this.tile_sheet.tile_width, this.tile_sheet.tile_height, destination_x, destination_y, this.tile_sheet.tile_width, this.tile_sheet.tile_height);

      }

      /* Now we draw the finalized buffer to the display canvas. You don't need to
      use a buffer; you could draw your tiles directly to the display canvas. If
      you are going to scale your display canvas at all, however, I recommend this
      method, because it eliminates antialiasing problems that arize due to scaling
      individual tiles. It is somewhat slower, however. */
      this.context.drawImage(this.buffer.canvas, 0, 0, world.width, world.height, 0, 0, this.context.canvas.width, this.context.canvas.height);

    },

    /* Resizes the display canvas when the screen is resized. */
    resize:function(event) {

      display.context.canvas.width = document.documentElement.clientWidth - 16;

      if (display.context.canvas.width > document.documentElement.clientHeight - 16) {

        display.context.canvas.width = document.documentElement.clientHeight - 16;

      }

      /* That height_width_ratio comes into play here. */
      display.context.canvas.height = display.context.canvas.width * display.height_width_ratio;

      display.buffer.imageSmoothingEnabled = display.context.imageSmoothingEnabled = false;

      display.render();

    }

  };

  /* The world holds information about the tile map. */
  world = {

    map: [7, 7, 8, 8, 8, 8, 8, 8,
          0, 7, 7, 7, 7, 8, 8, 8,
          1, 7, 7, 7, 7, 7, 7, 7,
          2, 3, 7, 7, 6, 7, 6, 7,
          4, 2, 5, 5, 5, 5, 5, 5],

    columns:8,

    //height: document.documentElement.clientHeight,
   // width: document.documentElement.clientHeight

      height: 32,
      width: 124


  };


  //// INITIALIZE ////

  /* Before we can draw anything we have to load the tile_sheet image. */
  display.tile_sheet.image.addEventListener("load", function(event) {

    display.buffer.canvas.height = world.height;
    display.buffer.canvas.width  = world.width;
    display.height_width_ratio   = world.height / world.width;

    display.resize();

  });

  /* Start loading the image. */
  display.tile_sheet.image.src = "Ressources/Images/terrain.png";

  //window.addEventListener("resize", display.resize);

};

//Generate the map ****************************************


//Generate the map ****************************************

function drawMap2(){


let scaled_size = 3;
let sprite_size = 32;
let columns = 25;
let rows = 25;


let height = document.documentElement.clientHeight;
let width = document.documentElement.clientWidth;


let map = [370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370];



ctx.canvas.height = height;
ctx.canvas.width = width;

ctx.imageSmoothingEnabled = false;


let tile_sheet = {

      image:new Image(),// The actual graphic will be loaded into this.

      columns:32,
      tile_height:32,
      tile_width:32

    };

tile_sheet.image.src = "Ressources/Images/terrain.png";



//draw the map

      for (let index = map.length - 1; index > -1; -- in dex) {

        /* We get the value of each tile in the map which corresponds to the tile
        graphic index in the tile_sheet.image. */
        var value = map[index];

        /* This is the x and y location at which to cut the tile image out of the
        tile_sheet.image. */
        var source_x = (value % tile_sheet.columns) * tile_sheet.tile_width;
        var source_y = Math.floor(value / tile_sheet.columns) * tile_sheet.tile_height;

        /* This is the x and y location at which to draw the tile image we are cutting
        from the tile_sheet.image to the buffer canvas. */
        var destination_x = (index % columns) * tile_sheet.tile_width;
        var destination_y = Math.floor(index / columns) * tile_sheet.tile_height;

        /* Draw the tile image to the buffer. The width and height of the tile is taken from the tile_sheet object. */
        //this.buffer.drawImage(tile_sheet.image, source_x, source_y, tile_sheet.tile_width, tile_sheet.tile_height, destination_x, destination_y, tile_sheet.tile_width, tile_sheet.tile_height);

        buffer.drawImage(tile_sheet.image, source_x, source_y, tile_sheet.tile_width, tile_sheet.tile_height, destination_x * scaled_size, destination_y * scaled_size, tile_sheet.tile_width * scaled_size, tile_sheet.tile_height * scaled_size);

      }

ctx.drawImage(buffer.canvas, 0, 0, map.width, map.height, 0, 0, ctx.canvas.width, ctx.canvas.height);


for(let y = viewport.startTile[1]; y <= viewport.endTile[1]; ++y){
    for(let x = viewport.startTile[0]; x <= viewport.endTile[0]; ++x){




    }
}

    /*
for (let x = 0; x < columns; x ++){

    for (let y = 0; y < rows; y++){

        //two dimensional map convert into a one dimensional map array
        let value = map[y * columns + x];
        let tile_x = x * scaled_size;
        let tile_y = y * scaled_size;

       ctx.drawImage(tile_sheet, value * sprite_size, 0, sprite_size, sprite_size, tile_x, tile_y, scaled_size, scaled_size);



    }
}
*/




};



//Generate the map ****************************************

//Generate the map ****************************************

let map = [370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,
           370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370,370];

let columns = 25;
let rows = 25;
let tileSize = 32;

function drawGame3(){

viewport.update(hero.x, hero.y);

for (let x = 0; x < columns; x ++){

    for (let y = 0; y < rows; y++){

        //two dimensional map convert into a one dimensional map array
        let value = map[y * columns + x];
        let tile_x = x * scaled_size;
        let tile_y = y * scaled_size;

       ctx.drawImage(tile_sheet, value * sprite_size, 0, sprite_size, sprite_size, tile_x, tile_y, scaled_size, scaled_size);



    }
};




};


//Generate the map ****************************************

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
    if (e.keyCode === 70){
        bullets.push(new Bullet(hero.angle));
    }
}, false);

// Set hero and brick first spawn

var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

    brick.x = 32 + (Math.random() * (canvas.width - 64));
	brick.y = 32 + (Math.random() * (canvas.height - 64));

	// Throw the mexican somewhere on the screen randomly
	mexican.x = 32 + (Math.random() * (canvas.width - 64));
	mexican.y = 32 + (Math.random() * (canvas.height - 64));
};



// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
        hero.angle = 44;
        if(hero.y < 0){
            hero.y = 0;
        }
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
        hero.angle = 250;
        if (hero.y + hero.size > ctx.canvas.height){
            //hero.y -= 50;
            hero.y = ctx.canvas.height + hero.size;
        }
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
        hero.angle = 0;
        if (hero.x < 0){
            hero.x = 0;
        }
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
        hero.angle = 181;
        if (hero.x + hero.size > ctx.canvas.width){
            hero.x = 1850;
        }
	}

    viewport.update( hero.x, hero.y);

	// When the mexican touches Trump

	if (
		hero.x <= (mexican.x + 32)
		&& mexican.x <= (hero.x + 32)
		&& hero.y <= (mexican.y + 32)
		&& mexican.y <= (hero.y + 32)
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

function drawMexicans(){

    mexicans.forEach(function(mexican, i){
            if(mexicanReady){
                ctx.drawImage(mexicanImage, mexican.x, mexican.y);
            }
    });
}

function mexicanMove(modifier){

    mexicans.forEach(function(mexican){

        if(!(mexican.dead))
            {



    var diffx = Math.floor(hero.x - mexican.x);
    var diffy = Math.floor(hero.y - mexican.y);

    //Distance min between trump and mexicans
    let gap = 20;


    if (diffy < -gap) { // Player holding up
		mexican.y -= mexican.y * modifier;
	}
	if (diffy > gap) { // Player holding down
		mexican.y += mexican.y * modifier;
	}
	if (diffx < -gap) { // Player holding left
		mexican.x -= mexican.x * modifier;
	}
	if (diffx > gap) { // Player holding right
		mexican.x += mexican.x * modifier;
	}

        //when mexicans touch our President
        if (
		  hero.x <= (mexican.x + 32)
		  && mexican.x <= (hero.x + 32)
		  && hero.y <= (mexican.y + 32)
		  && mexican.y <= (hero.y + 32)
	       )
        {

        //Decrease life of Trump
        heroHealth.value -= 1;
        if(heroHealth.value <= 0)
            {
            alert("You are dead !")
            }
	}

        //when bullets touch a mexican

       for(let i=0; i<bullets.length;i++)
           {

            if(
                mexican.x <= (bullets[i].x + 32)
                && bullets[i].x <= (mexican.x + 32)
		        && mexican.y <= (bullets[i].y + 32)
		        && bullets[i].y <= (mexican.y + 32)
	           )
            {
                mexican.life -= 1;
                console.log("Touched !!!!")
                if(mexican.life <= 0)
                    {
                       mexican.dead = true;
                    }
            }
           }
        }
    });
}


function resetBrick(){

    brick.x = 32 + (Math.random() * (canvas.width - 64));
	brick.y = 32 + (Math.random() * (canvas.height - 64));

}

// Draw everything
var render = function () {



	/*if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}*/

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

    if (brickReady) {
		ctx.drawImage(brickImage, brick.x, brick.y);
	}



     if (bullets.length !== 0) {
        for(let i = 0; i < bullets.length; i++){
            bullets[i].Update();
            bullets[i].Draw();
            ctx.drawImage(bulletImage, bullets[i].x, bullets[i].y);
        }
    }

	// number of bricks
    document.getElementById("bricks").innerHTML = bricksCount;
};


let totalMexicans = 0;
let startingPos = true;

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;


    //Set the camera dimensions
    viewport.screen = [canvas.width, canvas.height];

    //drawMap();

    drawMap2();

    render();
 /*
    if(startingPos)
    {
        for(let i = 0; i < 5; i++)
        {
            mexicans.push(new mexican());
        }

        startingPos = false;
    }
*/

    then = now;

    update(delta / 1000);
/*
    mexicanMove(delta / 8000);

    setInterval(drawMexicans(), 40);
*/




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
