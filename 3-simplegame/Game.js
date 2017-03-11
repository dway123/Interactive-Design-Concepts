//canvas initializations 
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
context.canvas.width  = window.innerWidth;
context.canvas.height = window.innerHeight;

var game = new Game();

function Game(){
	//immutable game settings
	const wallBounce = .5;										//velocity retained after bouncing from a wall
	const playerDx = Math.min(context.canvas.height, context.canvas.width)/75;
	const playerD2x = playerDx/20;
	const initOtherBirthPeriod= 150;

	//changing game variables
	var sounds = new SoundManager();
	var system = {
			gameState: 0,	//0 is menu, 1 is started, 2 is game 
			time: 0,
			paused: 0,
			score: 0,
			highScore: 0,
			difficulty: 1
		};
	var player, others;
	var currentWall;

	initialize = function(){
		sounds.reset();
		system.gameState = 0;	//0 is menu, 1 is started, 2 is game 
		system.time = 0;
		system.paused = 0;
		system.score = 0;
		system.difficulty = 1;
		player = {x: canvas.width/2, y: canvas.height/2, dx: 0, dy: 0, ballRadius: 20, innerColor: getRandomColor(), outerColor: getRandomColor(), lives: 1};
		others = [];
		currentWall = 0;
	}

	this.getHighScore = function(){
		return system.highScore;
	}

	//utility functions
	function getRandomInt(min, max){
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	//credit: https://www.paulirish.com/2009/random-hex-color-code-snippets/
	function getRandomColor(){
		return '#'+Math.floor(Math.random()*16777215).toString(16);
	}

	//mouse/keyboard listeners
	var keyPressed = {
		left : false,
		up : false,
		right : false,
		down : false,
		w : false,
		a : false,
		s : false,
		d : false,
		ctrl : false,
		m : false,
		p: false
	};

	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);

	function keyDownHandler(e){
		if(e.keyCode == 37){
			keyPressed.left = true;
		}
		else if(e.keyCode == 38){
			keyPressed.up = true;
		}
	    else if(e.keyCode == 39){
	        keyPressed.right = true;
	    }
	    else if(e.keyCode == 40){
	    	keyPressed.down = true;
	    }
	    else if(e.keyCode == 87){
			keyPressed.w = true;
		}
		else if(e.keyCode == 65){
			keyPressed.a = true;
		}
	    else if(e.keyCode == 83){
	        keyPressed.s = true;
	    }
	    else if(e.keyCode == 68){
	    	keyPressed.d = true;
	    }  
	    else if(e.keyCode == 17){
	    	keyPressed.ctrl = true;
		}
		else if(e.keyCode == 77){
	    	keyPressed.m = true;
	    	sounds.mute();
	    } 
	    else if(e.keyCode == 80){
	    	keyPressed.p = true;
	    	pause();
	    }
	    else if(e.keyCode == 32){
	    	initialize();
	    }
	}

	function keyUpHandler(e){
		if(e.keyCode == 37){
			keyPressed.left = false;
		}
		else if(e.keyCode == 38){
			keyPressed.up = false;
		}
	    else if(e.keyCode == 39){
	        keyPressed.right = false;
	    }
	    else if(e.keyCode == 40){
	    	keyPressed.down = false;
	    }
	    else if(e.keyCode == 87){
			keyPressed.w = false;
		}
		else if(e.keyCode == 65){
			keyPressed.a = false;
		}
	    else if(e.keyCode == 83){
	        keyPressed.s = false;
	    }
	    else if(e.keyCode == 68){
	    	keyPressed.d = false;
	    }  
	    else if(e.keyCode == 17){
	    	keyPressed.ctrl = false;
		}
		else if(e.keyCode == 77){
	    	keyPressed.m = false;
	    }
	    else if(e.keyCode == 80){
	    	keyPressed.p = false;
	    }
	}

	document.addEventListener("mousemove", mouseMoveHandler, false);
	//if ctrl is pressed, mouse locations will determine ball location
	function mouseMoveHandler(e){
		if(!keyPressed.ctrl){return;}
	    var relativeX = e.clientX - canvas.offsetLeft;
	    var relativeY = e.clientY - canvas.offsetTop;
	    if(relativeX > 0 && relativeX < context.canvas.width){
	        player.x = relativeX;
	        player.dx = 0;
	    }
	    if(relativeY > 0 && relativeY < context.canvas.height){
	    	player.y = relativeY;
	    	player.dy = 0;
	    }
	}

	function updateScore(){
		system.score = system.time;
		if(system.score > system.highScore){
			system.highScore = system.score;
		}
	}

	function pause(){
		system.paused = !system.paused;
		if(!system.paused){
			draw();
		}
	}

	function addOther(){
		var mindx = 5;
		var maxdx = 8;
		var x, y, dx, dy;
		var otherLifetime = Math.ceil(1.25 * system.difficulty * initOtherBirthPeriod);
		var ballRadius = getRandomInt(canvas.height/200,canvas.height/100);
		if(currentWall == 0){
			x = 0 + 2 * ballRadius;
			y = getRandomInt(0 + 2 * ballRadius, context.canvas.height - 2 * ballRadius);
			dx = getRandomInt(mindx,maxdx);
			dy = getRandomInt(-maxdx,maxdx);
		}
		else if(currentWall == 1){
			x = getRandomInt(0 + 2 * ballRadius, context.canvas.width - 2 * ballRadius);
			y = 0 + ballRadius;
			dx = getRandomInt(-maxdx,maxdx);
			dy = getRandomInt(mindx,maxdx);
		}
		else if(currentWall == 2){
			x = canvas.width - 2 * ballRadius;
			y = getRandomInt(0 + 2 * ballRadius, context.canvas.height - 2 * ballRadius);
			dx = getRandomInt(-maxdx,-mindx);
			dy = getRandomInt(-maxdx,maxdx);
		}
		else if(currentWall == 3){
			x = getRandomInt(0 + 2 * ballRadius, context.canvas.width - 2 * ballRadius);
			y = canvas.height - 2 * ballRadius;
			dx = getRandomInt(-maxdx,maxdx);
			dy = getRandomInt(-maxdx,-mindx);
		}
		others.push({x: x, y: y, dx: dx, dy: dy, ballRadius: ballRadius, color: getRandomColor(), lifetime: otherLifetime});
	}

	//draw functions
	function drawPlayers(){
		context.beginPath();
	    context.arc(player.x, player.y, player.ballRadius, 0, Math.PI*2);
	    context.fillStyle = player.outerColor;
	    context.fill();
	    context.closePath();

	    context.beginPath();
	    context.arc(player.x, player.y, player.ballRadius/2, 0, Math.PI*2);
	    context.fillStyle = player.innerColor;
	    context.fill();
	    context.closePath();
	}

	function drawOthers(){
		for(i = 0; i < others.length; i++){
			context.beginPath();
		    context.arc(others[i].x, others[i].y, others[i].ballRadius, 0, Math.PI*2);
		    context.fillStyle = others[i].color;
		    context.fill();
		    context.closePath();
		}
	}

	function drawText(){
		drawTopText();
		drawMiddleText();
		drawBottomText();
		drawTopLeftText();
	}

	function fontSetup(fontSize = 20, align = "center", font = "Arial", color = "gray"){
		context.font = fontSize + "px " + font;
		context.fillStyle = color;
		context.textAlign = align;
	}

	function drawBottomText(){
		var fontSize = 20;
		fontSetup(fontSize);
		var text = "";

		if(system.gameState == 0){
			text = "wasd or arrow keys to move, m to mute, p to pause";
		}
		else if(system.gameState == 1 || system.gameState == 2){
			text = "Score: " + system.score;
		}
		else{
			text = "ERROR: unrecognized system.gameState = " + system.gameState;
		}
		context.fillText(text, canvas.width/2, canvas.height - fontSize);
	}

	function drawMiddleText(){
		var fontSize = Math.ceil(Math.max(player.ballRadius,canvas.height/4)/2);
		fontSetup(fontSize);
		var text = "";

		if(system.paused){
			text = "paused";
		}
		else{
			if(system.gameState == 0 || system.gameState == 1){
				return;
			}
			else if(system.gameState == 2){
				text = "GAME OVER";
			}
			else{
				text = "ERROR: unrecognized system.gameState = " + system.gameState;
			}
		}
		context.fillText(text, canvas.width/2, canvas.height/2+player.ballRadius/4);
	}

	function drawTopText(){
		var fontSize = 20;
		fontSetup(fontSize);
		var text = "";

		if(system.gameState == 0){
			text = "Welcome! Please bounce against a wall to begin. :)";
		}
		else if(system.gameState == 1){
			return;
		}
		else if(system.gameState == 2){
			text = "Please press space to try again";
		}
		else{
			text = "ERROR: unrecognized system.gameState = " + system.gameState;
		}
		context.fillText(text, canvas.width/2, 0 + fontSize);
	}

	function drawTopLeftText(){
		var fontSize = 20;
		fontSetup(fontSize = fontSize, align = "left");
		context.fillText("High Score: " + system.highScore, fontSize/2, 0 + fontSize);
	}

	function updateVolume(){
		sounds.setVolume(Math.max(1 - others.length/150, 0));
	}

	//move functions
	function onPlayerBounce(){
		addOther();
		player.ballRadius = Math.max(player.ballRadius/2, others.length);
		sounds.beeps.playTopNote();
		sounds.beeps.nextChord();
		if(system.gameState == 0){
			system.gameState = 1;
		}		
	}

	function onOtherBounce(){
		player.ballRadius++;
		sounds.beeps.playNote();
	}

	function movePlayers(){
		//check keyboard
		var dxtarget, dytarget;
		if(keyPressed.right || keyPressed.d) {
			dxtarget = playerDx;
		}
		else if(keyPressed.left || keyPressed.a) {
			dxtarget = -playerDx;
		}
		else{
			dxtarget = 0;
		}
	    if(keyPressed.up || keyPressed.w){
	    	dytarget = -playerDx;
	    }
	    else if(keyPressed.down || keyPressed.s){
	    	dytarget = playerDx;
	    }
	    else{
	    	dytarget = 0;
	    }

	    if(player.dx > dxtarget){
	    	player.dx = Math.floor(player.dx - playerD2x);
	    }
	    else if(player.dx < dxtarget){
	    	player.dx = Math.ceil(player.dx + playerD2x);
	    }
	    if(player.dy > dytarget){
	    	player.dy = Math.floor(player.dy - playerD2x);
	    }
	    else if(player.dy < dytarget){
	    	player.dy = Math.ceil(player.dy + playerD2x);
	    }

	    //adjust location via speed
		if(player.x + player.dx > canvas.width-player.ballRadius || player.x + player.dx < player.ballRadius) {
	        player.dx = -player.dx * wallBounce;
	        onPlayerBounce();
	    }
	    if(player.y + player.dy > canvas.height-player.ballRadius || player.y + player.dy < player.ballRadius) {
	        player.dy = -player.dy * wallBounce;
	        onPlayerBounce();
	    }
	    player.x += Math.floor(player.dx);
	    player.y += Math.floor(player.dy);

	}

	function moveOthers(){
		for(i = 0; i < others.length; i++){
			if((others[i].x + others[i].dx + others[i].ballRadius > canvas.width) || (others[i].x + others[i].dx - others[i].ballRadius < 0)) {
		        others[i].dx = -others[i].dx * wallBounce;
		        onOtherBounce();
		    }
		    if((others[i].y + others[i].dy + others[i].ballRadius > canvas.height) || (others[i].y + others[i].dy - others[i].ballRadius < 0)) {
		        others[i].dy = -others[i].dy * wallBounce;
		        onOtherBounce();
		    }
		    others[i].x += others[i].dx;
		    others[i].y += others[i].dy;
		}
	}

	//others have a lifetime, delete them if it reaches 0
	function othersGrowOlderAndDie(){
		for(i = 0; i < others.length; i++){
			others[i].lifetime--;
			if(others[i].lifetime <= 0){
				others.splice(i,1);
			}
		}
	}

	//detects collision between player and others
	//if collision, player.lives-- and the other is deleted
	function playerOtherCollisionDetection(){
		var dx, dy;
		for(i = 0; i < others.length; i++){
			dx = player.x - others[i].x;
			dy = player.y - others[i].y;
			if((player.ballRadius + others[i].ballRadius) > Math.sqrt(dx*dx + dy*dy)){
				player.lives--;
				others.splice(i,1);
				if(player.lives <= 0){
					system.gameState = 2;
				}
			}
		}
	}
	

	//main function
	function draw(){
		//responsive to window size changes
		context.canvas.width  = window.innerWidth;
		context.canvas.height = window.innerHeight;
		context.clearRect(0, 0, canvas.width, canvas.height);

		//update things via system.time
		system.time++;
		if(system.gameState == 1){
			updateScore();
			if(system.time % Math.ceil(initOtherBirthPeriod/system.difficulty) == 0){
				addOther();
				addOther();
				addOther();
				currentWall = (currentWall + 1) % 4;
				system.difficulty*= 1.025;
			}	
		}		
		
		//state changes
		playerOtherCollisionDetection();
		othersGrowOlderAndDie();

		movePlayers();
		moveOthers();

		updateVolume();

		//drawing objects
		drawPlayers();
		drawOthers();
		drawText();

		if(!system.paused){
			requestAnimationFrame(draw);
		}
	}
	initialize();
	draw();
}