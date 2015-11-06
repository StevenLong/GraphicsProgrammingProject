//create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

//set canvas dimentions
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

//setup ground image
var groundImageReady = false;
var groundImage = new Image();
groundImage.onload = function() {
	groundImageReady = true;
};
groundImage.src = "resources/SeaBase.png";
groundImage.height = canvas.height;
groundImage.width = canvas.width;

//set up player images
var turretReady = false;
var turretImage = new Image();
turretImage.onload = function () {
	turretReady=true;
};
turretImage.src = "resources/turretFixed.png";

//var torpedoImg = new Image();
//torpedoImg.src = "resources/Torpedo.png";

//game objects
var turret = {
	x: (canvas.height - 70),
	y: (canvas.width/2),
	speed: 6,
	isAlive: false
}

/*var torpedo = {
	x: 10,
	y: null,
	speed: 1
}*/

var enemies = [];
var newEnemy = null;
var next = 0;

//creates new enemies, adds them to enemies array
var populateEnemies = function() {
	
	if(enemies.length < 10){
		var randomNumber = Math.floor((Math.random() * (canvas.width - 75))+1);
		newEnemy = {
			x:10,
			speed: 1,
			y: randomNumber
		}//torpedo;
		//newEnemy.y = randomNumber;
		enemies[next] = newEnemy;
		next++;
	}
};

//function which will tile a given image
function tile(context, image, tiles){
    for(r=0; r<tiles; r++){
        for(c=0; c<tiles; c++){
            context.drawImage(image, 
            (image.width/tiles)*r, (image.height/tiles)*c, 
             image.width/tiles,     image.height/tiles);
        }
    }
}


//var enemySprites = [10];

/*var populateSprites = function(){
	for(var i = enemySprites.length - 1; i >= 0; i--){
		//enemySprites[i] = new Image();
		enemySprites[i] = "resources/Torpedo.png";
	}
};*/

//Draws all game images
var draw = function (){
	//Tiles the ground image
	if(groundImageReady){
		tiles = 3;
		tile(ctx, groundImage, tiles);
	}

	//draws the player controlled turret image
	if(turretReady){
		ctx.drawImage(turretImage, turret.y ,turret.x);
	}

	//draws the score
	if(turret.isAlive){
		ctx.fillStyle = "rgb(250,250,250)";
		ctx.font = "24px Helvetica";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillText("Score: " + score, 32,32);
	}
	

	//This if statement prevents the game from continuing if the player is not alive
	if(turret.isAlive){
		//loops through all enemy images and draws each one
		for (var i = enemies.length - 1; i >= 0; i--) {
			var image = new Image();
			image.src = "resources/Torpedo.png";//enemySprites[i];
			if(enemies[i] != null){
				ctx.drawImage(image, enemies[i].y, enemies[i].x);
			}
		};

			//loops through all player shots and draws each one
		for(var i = shots.length - 1; i >= 0; i--){
				var shotImg = new Image();
				shotImg.src = "resources/Bullet.png";
				ctx.drawImage(shotImg, shots[i].y, shots[i].x);
		};
	}
	//else{gameOver()}

}

//Handles all user input
window.addEventListener("keydown", function(event){

	//handles left and right player inputs
	if(event.keyCode == 37 && turret.y>0){
		turret.y -= Math.min(turret.speed);
	}
	else if(event.keyCode == 39 && turret.y<(canvas.width - turretImage.width)){
		turret.y += Math.min(turret.speed);
	}

	//handles player shoot function
	if(event.keyCode == 88){
		fire();
	}
});

//arr to contain all player shots
var shots = [];

//Creates a bullet object to contain position and speed of bullet, then adds it to the shots arr
var fire = function(){
	var shot = {
		x: turret.x,
		y: turret.y+15,
		speed: 5
	}

	shots[shots.length] = shot;
};

//function for updating game objects/images, checking collision, and destroying objects which go out of bounds
var update = function(){
	if(turret.isAlive){
		//Loops through enemies, updating the position of each one
		for (var i = enemies.length - 1; i >= 0; i--) {
			if(enemies[i] != null){
				enemies[i].x += enemies[i].speed;
			}
		};

		//loops through each player shot, updating the position of each one
		for (var i = shots.length - 1; i >= 0; i--) {
			if(shots[i] != null){
				shots[i].x -= shots[i].speed;
			}
		};

		//collision detection/OOB and win/lose

		for (var i = enemies.length - 1; i >= 0; i--) {
			if(enemies[i] != null && enemies[i].x > (canvas.height + 35)){
				enemies[i].x = -35;
				score = score - 50;
			}
		};

		for (var i = shots.length - 1; i >= 0; i--) {
			if(shots[i] != null && shots[i].x < 0){
				shots.splice(i, 1);
			}

		};

		for (var i = shots.length - 1; i >= 0; i--) {
			if(shots[i] != null){
				for (var j = enemies.length - 1; j >= 0; j--) {
					if(enemies[j] != null && shots[i] != null){
						if( 
							enemies[j].x <= (shots[i].x + 32)
							&& shots[i].x <= (enemies[j].x + 32)
							&& enemies[j].y <= (shots[i].y + 32)
							&& shots[i].y <= (enemies[j].y + 32)
						){
							shots.splice(i, 1);
							enemies.splice(j, 1);
							score += 100;
						}
					}
				}
			}
		};

		for (var i = enemies.length - 1; i >= 0; i--) {
			if(enemies[i] != null){
				if(
					enemies[i].x <= (turret.x + 128)
					&& turret.x <= (enemies[i].x + 32)
					&& enemies[i].y <= (turret.y + 90)
					&& turret.y <= (enemies[i].y + 32)
				){
					turret.isAlive = false;
				}
			}
		};
	}
	else{gameOver();}
	
};

var gameOver = function(){	

	ctx.fillText("Game Over! Your Score: " + score + "		Press S To Restart", 32, 32);

	window.addEventListener("keydown", function(event){
		if(turret.isAlive == false && event.keyCode == 83){
			score = 0;
			enemies.length = 0;
			//populateEnemies();
			location.reload();
		}
	});
}

var start = function(){

	ctx.fillStyle = "rgb(0,0,0)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Press S to Start", 32, 32);

	window.addEventListener("keydown", function(event){
		if(turret.isAlive == false && event.keyCode == 83){
			turret.isAlive = true;
			main();
		}
	});

}

var score = 0;

var main = function(){
	draw();
	populateEnemies();
	update();
	requestAnimationFrame(main);
}

//populateSprites();
//main();
start();