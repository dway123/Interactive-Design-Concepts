function Player(origX, origY, ctx, id, options){
	const moveSpeed = 5;

	this.id = id;
	this.base = new Ball(origX, origY, ctx, 15, (options.color || "gray"));
	this.bullets = new BulletGroup({});
	this.turret = new Turret(ctx, {});
	this.dbRef = firebase.database().ref('players/' + this.id);

	var lives = 3;
	var context = ctx;

	var actions = 0; //used to send to db less often

	var keyMap = options.keyMap;

	this.sendToDB = function(){
		var base = {
			x: this.base.x,
			y: this.base.y,
			turretAngle: this.turret.getAngle()
		}
		this.dbRef.set(base);
	}

	this.die = function(){
		lives--;
	}

	this.getLives = function(){
		return lives;
	}

	this.render = function(){
	    this.turret.render(this.base.x, this.base.y);

	    //render base
	    this.base.render();
	    this.bullets.render();
	}

	degreesToRadians = function(degrees){
		return degrees*Math.PI/180;
	}

	this.tryShoot = function(){
		if(this.turret.trigger()){
			var bullet = this.turret.getShotBullet(this.base.x, this.base.y, this.base.color);
			this.bullets.push(bullet);
			return true;
		}
		return false;
	}

	this.input = function(keys){
		var hadInput = false;
		this.base.dx = 0;
		this.base.dy = 0;

		//check Pressed keys
		for (var key in keys) {
	        if (!keys.hasOwnProperty(key)) continue;
	        if (key == keyMap.left) {		//left/a
	            this.base.dx -= moveSpeed;
	        }
	        else if (key == keyMap.right) {	//right/d
	            this.base.dx += moveSpeed;
	        }
	        
	        if (key == keyMap.up) {			//up/w
	            this.base.dy -= moveSpeed;
	        }
	        else if (key == keyMap.down) {	//down/s
	           	this.base.dy += moveSpeed;
	        }

	        if(key == keyMap.cw){			//q
	        	this.turret.rotate(-1);
	        }
	        if(key == keyMap.ccw){			//e
	        	this.turret.rotate(1);
	        }

	        if(key == keyMap.shoot){		//space
	        	this.tryShoot();
	        }
	        hadInput = true;
	    }
	    if(hadInput){
	    	actions++;
	    }
	    if(actions > 10){
	    	actions -= 10;
	    	this.sendToDB();
	    }
	}

	this.move = function(){
	    this.base.move();
	    this.bullets.move();
	}	
	this.die = function(){
		lives--;
	}
	this.getLives = function(){
		return lives;
	}
}