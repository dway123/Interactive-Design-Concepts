function Turret(ctx, options){

	var angle = options.angle || 0;
	var l = options.length || 10;
	var w = options.width || 25;
	var color = options.color || "black";
	
	var shootDelay = options.delay || 200;
	var canShoot = true;
	var context = ctx;

	this.render() = function(x, y){
		context.save();

	    context.translate(x, y);
	    context.rotate(degreesToRadians(angle)); 
	    context.translate(-x, -y);

	   	context.fillStyle = color;
		context.fillRect(x, y - l/2, w, l);

	    context.restore();
	}

	// this.outsideShoot(){
	// 	if(turret.trigger()){
	// 		var bullet = turret.getBullet(base.x, base.y, base.color);
	// 		this.bullets.push(bullet);
	// 		return true;
	// 	}
	// 	return false;
	// }

	this.trigger = function(){
		if(!canShoot){
			return false;
		}

		canShoot = false;
		setTimeout(function(){
			canShoot = true;
		}, shootDelay);
		return true;
	}

	this.getBullet = function(basex, basey, baseColor){
		//generate another ball from turret
		var bulletLocation = {
			x: basex + w * Math.cos(degreesToRadians(angle)),
			y: basey + w * Math.sin(degreesToRadians(angle))
		}
		var bullet = new Ball(bulletLocation.x, bulletLocation.y, context, 5, baseColor);

		var bulletSpeed = 5;
		bullet.dx = bulletSpeed * Math.cos(degreesToRadians(angle));
		bullet.dy = bulletSpeed * Math.sin(degreesToRadians(angle));
		
		// this.bullets.push(bullet);
		return bullet;
	}
}