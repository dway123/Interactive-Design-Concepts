function Player(origX, origY, ctx){
	const pdx = 5;
	const pd2x = dx/20;
	
	var x = origX;
	var y = origY;
	var dx = 0;
	var dy = 0;
	var ballRadius = 5;
	var lives = 3;
	var color = "black";
	var context = ctx;

	this.render = function(){
		context.beginPath();
	    context.arc(x, y, ballRadius, 0, Math.PI*2);
	    context.fillStyle = color;
	    context.fill();
	    context.closePath();
	}
	this.shoot = function(){

	}
	this.move = function(){

	}
	this.die = function(){

	}
}