/* 

References used: 

basic js audio tutorial: http://marcgg.com/blog/2016/11/01/javascript-audio/
official documentation: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API#Muting_the_theremin
frequencies: http://www.phy.mtu.edu/~suits/notefreqs.html

*/

//Beep class
//create sound context
var audiocontext = new (window.AudioContext || window.webkitAudioContext)();	//for compatability across different browsers
//TODO: create generalized "mix" node for clipping detection and fixingm
//TODO: CONFIRM COMPRESSOR WORKS VIA SENDING PLAYER TO EDGE AND LISTENING TO LACK OF CLIPPING
//https://www.html5rocks.com/en/tutorials/webaudio/games/
// var compressor = audiocontext.createDynamicsCompressor();
// mix.connect(compressor);
// compressor.connect(audiocontext.destination);

function Beep(frequency)
{	
	this.wave = "sine";
	this.minimumAmplitude = 0.00001;
	this.maximumAmplitude = 0.5;

	this.attack = .01;
	this.release = 3;

	this.frequency = frequency;
	this.context = audiocontext;

	this.oscillator = null;
	this.gain = null;

	this.beepSetup = function(){
		this.oscillator = this.context.createOscillator();
		this.oscillator.frequency.value = this.frequency;
		this.oscillator.type = this.wave;
		this.oscillator.start(this.context.currentTime);

		this.gain = this.context.createGain();
		this.oscillator.connect(this.gain);

		this.gain.gain.value = this.minimumAmplitude;
		this.gain.connect(this.context.destination);
	}

	this.beepTearDown = function(){
		this.oscillator = null;
		this.gain = null;
	}

	this.beepSetup();

	this.beep = function(){
		//https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/exponentialRampToValueAtTime
		this.readyToPlay = false;
		this.gain.gain.exponentialRampToValueAtTime(this.maximumAmplitude, this.context.currentTime + this.attack);
		this.gain.gain.exponentialRampToValueAtTime(this.minimumAmplitude, this.context.currentTime + this.attack + this.release);	

		this.oscillator.stop(this.context.currentTime + this.attack + this.release);	
		
		this.beepTearDown();	//due to oscillators being single-use objects
		this.beepSetup();
	}
}