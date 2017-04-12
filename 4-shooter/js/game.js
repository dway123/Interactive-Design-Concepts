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

	function render(){
		context.fillStyle = backgroundColor;
		context.fillRect(0, 0, canvas.width, canvas.height);
		for(var i = 0; i < players.length; i++){
			players[i].input(keys);
			players[i].move();
			players[i].render();
			text.drawMiddleBottom("Player lives: " + players[i].getLives());
		}
		
		text.drawMiddleTop("Welcome to the test.");
		requestAnimationFrame(render);
	}
}