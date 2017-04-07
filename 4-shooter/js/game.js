var game = new Game();
game.init();

function Game(){
	var canvas;
	var context;

	var player;

	var backgroundMusic;
	var backgroundColor = "white";

	this.init = function(){
		canvas = document.getElementById("canvas");
		context = canvas.getContext("2d");
		context.canvas.width  = window.innerWidth;
		context.canvas.height = window.innerHeight;

		backgroundMusic = new Audio("audio/music.mp3");
		backgroundMusic.loop = true;
		backgroundMusic.play();

		player = new Player(canvas.width/2, canvas.height/2, context);
		render();
	}

	function render(){
		context.fillStyle = backgroundColor;
		context.fillRect(0, 0, canvas.width, canvas.height);

		player.render();
		requestAnimationFrame(render);
	}
}