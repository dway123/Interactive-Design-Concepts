/* 
Manages sounds using the Web Audio API, as well as Beeps.js

Audio Graph (as of 3/23/17):
audioContext <- compressor <- mix <- Beeps < Beep(0-n) <- gain <- oscillator

References:
basic js audio tutorial: http://marcgg.com/blog/2016/11/01/javascript-audio/
official documentation: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API#Muting_the_theremin
frequencies: http://www.phy.mtu.edu/~suits/notefreqs.html

Possible Improvements:
- Clipping detection and avoidance
- stop making setVolume run every iteration...
*/

function SoundManager(){
	//create sound context
	var audioContext = new (window.AudioContext || window.webkitAudioContext)();	//for compatability across different browsers

	//https://www.html5rocks.com/en/tutorials/webaudio/games/
	var volume = 1;
	var muted = false;
	var mix = audioContext.createGain();
	var compressor = audioContext.createDynamicsCompressor();

	mix.connect(compressor);
	compressor.connect(audioContext.destination);

	mix.gain.value = volume;

	this.beeps = new Beeps(mix, audioContext);

	this.mute = function(){
		muted = !muted;
	}

	this.setVolume = function(vol){
		volume = vol;
		if(muted){
			mix.gain.value = 0;
		}
		else{
			mix.gain.value = volume;
		}
	}

	this.reset = function(){
		muted = false;
		this.setVolume(1);
	}
}