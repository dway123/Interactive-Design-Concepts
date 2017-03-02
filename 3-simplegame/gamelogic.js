	//sound setup
	var beeps = new Beeps();

	document.addEventListener("mousemove", mouseMoveHandler, false);
	//if ctrl is pressed, mouse locations will determine ball location
	function mouseMoveHandler(e) {
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

	//utility functions
	function getRandomInt(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	//credit: https://www.paulirish.com/2009/random-hex-color-code-snippets/
	function getRandomColor(){
		return '#'+Math.floor(Math.random()*16777215).toString(16);
	}

	//canvas initializations 
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	context.canvas.width  = window.innerWidth;
  	context.canvas.height = window.innerHeight;


	//overall initializations
	var wallbounce = .5;
	var paused = 0;
	var dx = Math.min(canvas.height, canvas.width)/75;
	var d2x = dx/20;
	var time = 0;

	//player initializations
	var player = {x: canvas.width/2, y: canvas.height/2, dx: 0, dy: 0, ballRadius: 10, color: getRandomColor(), lives: 1};
	var totalPlayerBounces = 0;

	//initializations for others
	var others = [];
	var currentWall = 0;
	var otherBirthPeriod = 200;
	var otherLifetime = otherBirthPeriod;

	function addOther(){
		var x, y, dx, dy;

		var ballRadius = getRandomInt(canvas.height/200,canvas.height/100);
		if(currentWall == 0){
			x = 0 + 2 * ballRadius;
			y = getRandomInt(0 + 2 * ballRadius, context.canvas.height - 2 * ballRadius);
			dx = getRandomInt(0,10);
			dy = getRandomInt(-10,10);
		}
		else if(currentWall == 1){
			x = getRandomInt(0 + 2 * ballRadius, context.canvas.width - 2 * ballRadius);
			y = 0 + ballRadius;
			dx = getRandomInt(-10,10);
			dy = getRandomInt(0,10);
		}
		else if(currentWall == 2){
			x = canvas.width - 2 * ballRadius;
			y = getRandomInt(0 + 2 * ballRadius, context.canvas.height - 2 * ballRadius);
			dx = getRandomInt(-10,0);
			dy = getRandomInt(-10,10);
		}
		else if(currentWall == 3){
			x = getRandomInt(0 + 2 * ballRadius, context.canvas.width - 2 * ballRadius);
			y = canvas.height - 2 * ballRadius;
			dx = getRandomInt(-10,10);
			dy = getRandomInt(-10,0);
		}
		currentWall = (currentWall + 1) % 4;
		others.push({x: x, y: y, dx: dx, dy: dy, ballRadius: ballRadius, color: getRandomColor(), lifetime: otherLifetime});
	}

	var totalOtherBounces = 0;

	//draw functions
	function drawPlayers(){
		context.beginPath();
	    context.arc(player.x, player.y, player.ballRadius, 0, Math.PI*2);
	    context.fillStyle = player.color;
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

	function othersGrowOlderAndDie(){
		for(i = 0; i < others.length; i++){
			others[i].lifetime--;
			if(others[i].lifetime == 0){
				others.splice(i,1);
			}
		}
	}

	function drawText(){
		var fontsize = 20;
		context.font = fontsize + "px Arial";
		context.fillStyle = "gray";
		context.textAlign = "center";

		var text = "";

		if(!totalPlayerBounces){												//before first bounce
			text = "wasd or arrow keys to move, m to mute, p to pause"
			context.fillText(text, canvas.width/2, canvas.height - fontsize);	//keyboard controls shown
		}
		else{
			if(player.lives <= 0){
				context.font = Math.ceil(Math.max(player.ballRadius,canvas.height/4)/2) + "px Arial";
				context.fillText("GAME OVER", canvas.width/2, canvas.height/2+player.ballRadius/4);

			}
			// context.font = Math.min(player.ballRadius, fontsize) + "px Arial";
			// context.fillText(Math.floor(player.ballRadius), player.x, player.y+Math.min(player.ballRadius, fontsize)/2-1);
			context.font = fontsize + "px Arial";
			text = "Score: " + time;
			context.fillText(text, canvas.width/2, canvas.height - fontsize);	//current game information shown
		}
	}

	function updateVolume(){
		setVolume(Math.max(1 - others.length/200,0));
	}

	//move functions
	function onPlayerBounce(){
		addOther();
		player.ballRadius = Math.max(player.ballRadius/2, others.length);
		var range = Math.log(player.ballRadius)*2;
		for(var i = 0; i < others.length; i++){
			others[i].dx += getRandomInt(-range, range);
			others[i].dy += getRandomInt(-range, range);
		}
		beeps.playTopNote();
		totalPlayerBounces++;
	}

	function onOtherBounce(){
		player.ballRadius++;
		beeps.playNote();
		totalOtherBounces++;
	}

	function movePlayers(){
		//check keyboard
		var dxtarget, dytarget;
		if(keyPressed.right || keyPressed.d) {
	        dxtarget = dx;
	    }
	    else if(keyPressed.left || keyPressed.a) {
	        dxtarget = -dx;
	    }
	    else{
	    	dxtarget = 0;
	    }
	    if(keyPressed.up || keyPressed.w){
	    	dytarget = -dx;
	    }
	    else if(keyPressed.down || keyPressed.s){
	    	dytarget = dx;
	    }
	    else{
	    	dytarget = 0;
	    }

	    if(player.dx > dxtarget){
	    	player.dx -= d2x;
	    }
	    else if(player.dx < dxtarget){
	    	player.dx += d2x;
	    }
	    if(player.dy > dytarget){
	    	player.dy -= d2x;
	    }
	    else if(player.dy < dytarget){
	    	player.dy += d2x;
	    }

	    //adjust location via speed
		if(player.x + player.dx > canvas.width-player.ballRadius || player.x + player.dx < player.ballRadius) {
	        player.dx = -player.dx * wallbounce;
	        onPlayerBounce();
	    }
	    if(player.y + player.dy > canvas.height-player.ballRadius || player.y + player.dy < player.ballRadius) {
	        player.dy = -player.dy * wallbounce;
	        onPlayerBounce();
	    }
	    player.x += Math.floor(player.dx);
	    player.y += Math.floor(player.dy);

	}

	function moveOthers(){
		for(i = 0; i < others.length; i++){
			if((others[i].x + others[i].dx + others[i].ballRadius > canvas.width) || (others[i].x + others[i].dx - others[i].ballRadius < 0)) {
		        others[i].dx = -others[i].dx * wallbounce;
		        onOtherBounce();
		    }
		    if((others[i].y + others[i].dy + others[i].ballRadius > canvas.height) || (others[i].y + others[i].dy - others[i].ballRadius < 0)) {
		        others[i].dy = -others[i].dy * wallbounce;
		        onOtherBounce();
		    }
		    others[i].x += others[i].dx;
		    others[i].y += others[i].dy;
		}
	}

	function playerOtherCollisionDetection(){
		var dx, dy;
		for(i = 0; i < others.length; i++){
			dx = player.x - others[i].x;
			dy = player.y - others[i].y;
			if((player.ballRadius + others[i].ballRadius) > Math.sqrt(dx*dx + dy*dy)){
				player.lives--;
				others.splice(i,1);
			}
		}
	}

	function pause(){
		paused = !paused;
		if(!paused){
			draw();
		}
	}

	//main function
	function draw(){
		time++;
		if(time % otherBirthPeriod == 0){
			addOther();
			otherBirthPeriod = Math.ceil(.98*otherBirthPeriod);
		}

		context.canvas.width  = window.innerWidth;
		context.canvas.height = window.innerHeight;
		context.clearRect(0, 0, canvas.width, canvas.height);
		
		othersGrowOlderAndDie();
		drawPlayers();
		drawOthers();
		drawText();
		updateVolume();

		movePlayers();
		moveOthers();
		playerOtherCollisionDetection();

		if(!paused){
			requestAnimationFrame(draw);
		}
	}	
	draw();