var game = new Game();
game.init();

function Game(){
	var canvas;
	var context;
	var text;

	var players;

	var backgroundMusic;
	var backgroundColor = "white";

	//reference for jquery mouse movement
	//http://stackoverflow.com/questions/7298507/move-element-with-keypress-multiple
	var keys = {};


	this.init = function(){
		//canvas setup
		canvas = document.getElementById("canvas");
		context = canvas.getContext("2d");
		context.canvas.width  = window.innerWidth;
		context.canvas.height = window.innerHeight;

		//background music setup
		backgroundMusic = new Audio("audio/music.mp3");
		backgroundMusic.loop = true;
		// backgroundMusic.play();

		//keys setup
		$(document).keydown(function(e) {
		    keys[e.keyCode] = true;
		});

		$(document).keyup(function(e) {
		    delete keys[e.keyCode];
		});

		//objects setup
		players = [];
		var p1 = new Player(canvas.width*1/4, canvas.height/2, context, 1, {color: "red"});
		var p2Controls = {
			left: 37,	//arrow keys (on numpad)
			right: 39, 	
			up: 38,
			down: 12,	//clear (5 on numpad)
			cw: 36,		//home
			ccw: 33,		//pgup
			shoot: 40	//down arrow 
		}
		var p2 = new Player(canvas.width*3/4, canvas.height/2, context, 2, {color: "blue", keyMap: p2Controls});
		players.push(p1);
		players.push(p2);
		text = new Text(context);

		//begin rendering
		render();
	}


	//collision detection between players and bullets (not walls tho)
	function playerBallCollisionDetection(){
		for(var i = 0; i < players.length; i++){		//for each player
			var player = players[i];
			for(var j = 0; j < players.length; j++){	//check each other player/team's bullets
				if(i != j){
					var otherBullets = players[j].bullets.bullets;
					for(var k = 0; k < otherBullets.length; k++){
						var dx = player.base.x - otherBullets[k].x;
						var dy = player.base.y - otherBullets[k].y;
						var dr2 = dx * dx + dy * dy;
						var r1 = player.base.radius;
						var r2 = otherBullets[k].radius;
						var rsq = (r1 + r2) * (r1 + r2);
						if(rsq >= dr2){
							players[i].die();
							players[j].bullets.removeBulletById(k);
							if(players[i].getLives() <= 0){
								console.log(players[i].getLives());
								players.splice(i, 1);		//player hit!!!	
							}
						}
					}
				}
			}
		}
	}	

	function render(){

		context.fillStyle = backgroundColor;
		context.fillRect(0, 0, canvas.width, canvas.height);

		playerBallCollisionDetection();

		for(var i = 0; i < players.length; i++){
			players[i].input(keys);
			players[i].move();
			players[i].render();
		}

		if(players[0]){
			text.drawMiddleTop("Red Player lives: " + players[0].getLives());
		}
		if(players[1]){
			text.drawMiddleBottom("Blue Player lives: " + players[1].getLives());	
		}
		
		
		requestAnimationFrame(render);
	}
}