var game = new Game();
game.init();

function Game(){
	var canvas;
	var context;
	var text;

	var player;

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
		player = new Player(canvas.width/2, canvas.height/2, context);
		text = new Text(context);

		//begin rendering
		render();
	}

	function render(){
		context.fillStyle = backgroundColor;
		context.fillRect(0, 0, canvas.width, canvas.height);
		player.input(keys);
		player.move();
		player.render();
		text.drawMiddleBottom("Player lives: " + player.getLives());
		requestAnimationFrame(render);
	}
}