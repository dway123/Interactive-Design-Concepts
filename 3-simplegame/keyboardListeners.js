//not sure how code is meant to be isolated in javascript, so sorry for the bad isolation in my first js project...
//NOTE: mute() function from Beep.js is here...
//same with pause

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

//initialize
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
    	mute();
    } 
    else if(e.keyCode == 80){
    	keyPressed.p = true;
    	pause();
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