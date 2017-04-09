function Player(origX, origY, ctx){
	const moveSpeed = 10;
	const rotationSpeed = 5;
	
	var location = {
		x: origX,
		y: origY
	};

	var velocity = {
		x: 0,
		y: 0
	}

	var ballRadius = 15;
	var lives = 3;
	var color = "red";
	var context = ctx;
	var angle = 0;	//rotation about z axis

	var turret = {
		l: 10,
		w: 25,
		color: "black"
	};

	this.render = function(){
		context.save();

	    context.translate(location.x, location.y);
	    context.rotate( angle*Math.PI/180 ); 
	    context.translate(-location.x, -location.y);

	   	context.fillStyle = turret.color;
		context.fillRect(location.x, location.y - turret.l/2, turret.w, turret.l);

		context.beginPath();
	    context.arc(location.x, location.y, ballRadius, 0, Math.PI*2);
	    context.fillStyle = color;
	    context.fill();
	    context.closePath();

	    context.restore();
	}
	this.shoot = function(){
		console.log("shoot");
	}
	this.input = function(keys){
		velocity = {
			x: 0,
			y: 0
		};
		//check Pressed keys
		for (var key in keys) {
	        if (!keys.hasOwnProperty(key)) continue;
	        if (key == 37 || key == 65) {	//left/a
	            velocity.x -= moveSpeed;
	        }
	        else if (key == 39 || key == 68) {	//right/d
	            velocity.x += moveSpeed;
	        }
	        
	        if (key == 38 || key == 87) {	//up/w
	            velocity.y -= moveSpeed;
	        }
	        else if (key == 40 || key == 83) {	//down/s
	           	velocity.y += moveSpeed;
	        }

	        if(key == 81){	//q
	        	angle = (angle - rotationSpeed) % 360;
	        }
	        if(key == 69){	//e
	        	angle = (angle + rotationSpeed) % 360;
	        }

	        if(key == 32){	//space
	        	this.shoot();
	        }
	    }
	}

	this.move = function(){
	    const wallOffset = {
	    	x: 0,
	    	y: moveSpeed/2
	    }
	    //todo: collision detection here!!!
	    if(location.x + velocity.x - ballRadius < 0 + wallOffset.x){						//left wall
	    	velocity.x = Math.abs(velocity.x);
	    }
	    if(location.x + velocity.x + ballRadius > context.canvas.width - wallOffset.x) {	//right wall
	        velocity.x = -Math.abs(velocity.x);
	    }
	    if(location.y + velocity.x - ballRadius < 0 + wallOffset.y){						//upper wall
	    	velocity.y = Math.abs(velocity.y);
	    }
	    if(location.y + velocity.x + ballRadius > context.canvas.height - wallOffset.y) {	//lower wall
	        velocity.y = -Math.abs(velocity.y);
	    }

	    location.x += velocity.x;
	    location.y += velocity.y;
	}	
	this.die = function(){
		lives--;
	}
	this.getLives = function(){
		return lives;
	}
}