function Player(origX, origY, ctx, id, options){
	const moveSpeed = 10;
	const rotationSpeed = 5;

	var base = new Ball(origX, origY, ctx, 15, (options.color || "gray"));
	var bullets = new BulletGroup({});

	var lives = 3;
	var context = ctx;
	var angle = 0;	//rotation about z axis

	var turret = {
		l: 10,
		w: 25,
		color: "black",
		canShoot: true,
		shootDelay: 250
	};

	var keyMap = options.keyMap || {
		left: 65,	//a
		right: 68,	//d
		up: 87,		//w
		down: 83,	//s
		cw: 81,		//q
		ccw: 69,	//e
		shoot: 32	//space
	};

	this.render = function(){
		//render turret
		context.save();

	    context.translate(base.x, base.y);
	    context.rotate(degreesToRadians(angle)); 
	    context.translate(-base.x, -base.y);

	   	context.fillStyle = turret.color;
		context.fillRect(base.x, base.y - turret.l/2, turret.w, turret.l);

	    context.restore();

	    //render base
	    base.render();
	    bullets.render();
	    
	}

	degreesToRadians = function(degrees){
		return degrees*Math.PI/180;
	}


	this.tryShoot = function(){
		if(turret.canShoot){
			turret.canShoot = false;
			setTimeout(function(){
				turret.canShoot = true;
			}, turret.shootDelay);
			this.shoot();
		}
	}

	this.shoot = function(){
		//generate another ball from turret
		var bulletLocation = {
			x: base.x + turret.w * Math.cos(degreesToRadians(angle)),
			y: base.y + turret.w * Math.sin(degreesToRadians(angle))
		}
		var bullet = new Ball(bulletLocation.x, bulletLocation.y, ctx, 5, base.color);

		var bulletSpeed = 12;
		bullet.dx = bulletSpeed * Math.cos(degreesToRadians(angle));
		bullet.dy = bulletSpeed * Math.sin(degreesToRadians(angle));
		
		bullets.push(bullet);
	}

	this.input = function(keys){
		base.dx = 0;
		base.dy = 0;

		//check Pressed keys
		for (var key in keys) {
	        if (!keys.hasOwnProperty(key)) continue;
	        if (key == keyMap.left) {	//left/a
	            base.dx -= moveSpeed;
	        }
	        else if (key == keyMap.right) {	//right/d
	            base.dx += moveSpeed;
	        }
	        
	        if (key == keyMap.up) {	//up/w
	            base.dy -= moveSpeed;
	        }
	        else if (key == keyMap.down) {	//down/s
	           	base.dy += moveSpeed;
	        }

	        if(key == keyMap.cw){	//q
	        	angle = (angle - rotationSpeed) % 360;
	        }
	        if(key == keyMap.ccw){	//e
	        	angle = (angle + rotationSpeed) % 360;
	        }

	        if(key == keyMap.shoot){	//space
	        	this.tryShoot();
	        }
	    }
	}

	this.move = function(){
	    base.move();
	    bullets.move();
	}	
	this.die = function(){
		lives--;
	}
	this.getLives = function(){
		return lives;
	}
}