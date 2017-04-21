function Turret(ctx, options){

	this.angle = options.angle || 0;
	var length = options.length || 10;
	var width = options.width || 25;
	var color = options.color || "black";
	var bulletSpeed = options.bulletSpeed || 8;
	var rotationSpeed = options.rotationSpeed || 4;
	
	var delay = options.delay || 200;
	var canShoot = true;
	var context = ctx;

	this.render = function(x, y){
		context.save();

	    context.translate(x, y);
	    context.rotate(degreesToRadians(this.angle)); 
	    context.translate(-x, -y);

	   	context.fillStyle = color;
		context.fillRect(x, y - length/2, width, length);

	    context.restore();
	}

	//can it shoot? If so, set the delay so it doesn't for a while
	this.trigger = function(){
		if(!canShoot){
			return false;
		}

		canShoot = false;
		setTimeout(function(){
			canShoot = true;
		}, delay);
		return true;
	}

	//wow it shot. Now return the bullet
	this.getShotBullet = function(basex, basey, baseColor){
		var bulletLocation = {
			x: basex + width * Math.cos(degreesToRadians(this.angle)),
			y: basey + width * Math.sin(degreesToRadians(this.angle))
		}
		var bullet = new Ball(bulletLocation.x, bulletLocation.y, context, 5, baseColor);

		bullet.dx = bulletSpeed * Math.cos(degreesToRadians(this.angle));
		bullet.dy = bulletSpeed * Math.sin(degreesToRadians(this.angle));
		
		return bullet;
	}

	this.getAngle = function(){
		return this.angle;
	}

	this.saveTurret = function(){
		var options = {
			angle: this.angle,
			length: length,
			width: width,
			color: color,
			bulletSpeed: bulletSpeed,
			delay: delay,
			rotationSpeed: rotationSpeed
		}
	}

	this.rotate = function(direction){
		this.angle = (this.angle + direction * rotationSpeed) % 360;
	}
}