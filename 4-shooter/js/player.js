function Player(origX, origY, ctx){
	const moveSpeed = 10;
	const rotationSpeed = 5;

	var base = new Ball(origX, origY, ctx, 15, "red");

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

	var bullets = [];
	var bulletsShot = 0;
	var bulletLifetime = 1000;

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

	    //render bullets
	    bullets.forEach(function(bullet){
	    	bullet.render();
	    });
	}

	degreesToRadians = function(degrees){
		return degrees*Math.PI/180;
	}


	tryShoot = function(){
		if(turret.canShoot){
			turret.canShoot = false;
			setTimeout(function(){
				turret.canShoot = true;
			}, turret.shootDelay);
			shoot();
		}
	}

	shoot = function(){
		//generate another ball from turret
		var bulletLocation = {
			x: base.x + turret.w * Math.cos(degreesToRadians(angle)),
			y: base.y + turret.w * Math.sin(degreesToRadians(angle))
		}
		var bullet = new Ball(bulletLocation.x, bulletLocation.y, ctx, 5, "red");

		var bulletSpeed = 12;
		bullet.dx = bulletSpeed * Math.cos(degreesToRadians(angle));
		bullet.dy = bulletSpeed * Math.sin(degreesToRadians(angle));
		bullet.id = bulletsShot;
		bullets.push(bullet);

		var removeId = bulletsShot;
		setTimeout(function(){removeBulletId(removeId);}, bulletLifetime);

		bulletsShot++;
		console.log("shoot success: " + bullet.id);
	}

	removeBulletId = function(removeId){
		console.log("trying to remove " + removeId)
		var temp = bullets.filter(function(bullet) {
		    return bullet.id !== removeId;
		});
		bullets = temp;
		console.log(bullets);
		console.log(temp);
	}

	this.input = function(keys){
		base.dx = 0;
		base.dy = 0;

		//check Pressed keys
		for (var key in keys) {
	        if (!keys.hasOwnProperty(key)) continue;
	        if (key == 37 || key == 65) {	//left/a
	            base.dx -= moveSpeed;
	        }
	        else if (key == 39 || key == 68) {	//right/d
	            base.dx += moveSpeed;
	        }
	        
	        if (key == 38 || key == 87) {	//up/w
	            base.dy -= moveSpeed;
	        }
	        else if (key == 40 || key == 83) {	//down/s
	           	base.dy += moveSpeed;
	        }

	        if(key == 81){	//q
	        	angle = (angle - rotationSpeed) % 360;
	        }
	        if(key == 69){	//e
	        	angle = (angle + rotationSpeed) % 360;
	        }

	        if(key == 32){	//space
	        	tryShoot();
	        }
	    }
	}

	this.move = function(){
	    base.move();
	    bullets.forEach(function(bullet){
	    	bullet.move();
	    });
	}	
	this.die = function(){
		lives--;
	}
	this.getLives = function(){
		return lives;
	}
}