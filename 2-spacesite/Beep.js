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
var volume = 1;
var muted = 0;
var mix = audiocontext.createGain();
var compressor = audiocontext.createDynamicsCompressor();

mix.connect(compressor);
compressor.connect(audiocontext.destination);

mix.gain.value = volume;

function Beep(frequency)
{	
	this.wave = "sine";
	this.minimumAmplitude = 0.00001;
	this.maximumAmplitude = .3;

	this.attack = .01;
	this.release = 3;

	this.frequency = frequency;
	this.context = audiocontext;
	this.mix = mix;

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
		this.gain.connect(this.mix);
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
		
		this.beepTearDown();	//due to oscillators being single-use objects (I think this was bad design of the audio API, but meh)
		this.beepSetup();
	}
}

function Beeps()
{
	this.beepIndex = 0;
	this.chordIndex = 0;

	this.topBeep = new Beep(1046.00);
	// note: the first octave (<100 Hz) can't be played on laptop speakers, but do show up via earbuds/speakers
	this.beeps =
	[
		[
			//CEGC
			// new Beep(65.41),
			// new Beep(82.41),
			// new Beep(98.00),
			new Beep(130.81),
			new Beep(164.81),
			new Beep(196.00),
			new Beep(261.63),
			new Beep(329.63),
			new Beep(392.00),
			new Beep(523.25),
			new Beep(659.25),
			new Beep(783.99),
			new Beep(1046.50),
			new Beep(1318.51),
			new Beep(1567.98)
		],
		[
			//CFAC
			// new Beep(65.41),
			// new Beep(87.31),
			// new Beep(110.00),
			new Beep(130.81),
			new Beep(174.61),
			new Beep(220.00),
			new Beep(261.63),
			new Beep(349.23),
			new Beep(440.00),
			new Beep(523.25),
			new Beep(698.46),
			new Beep(880.00),
			new Beep(1046.50),
			new Beep(1396.91),
			new Beep(1760.00)
		],
		[
			//CEGC
			// new Beep(65.41),
			// new Beep(82.41),
			// new Beep(98.00),
			new Beep(130.81),
			new Beep(164.81),
			new Beep(196.00),
			new Beep(261.63),
			new Beep(329.63),
			new Beep(392.00),
			new Beep(523.25),
			new Beep(659.25),
			new Beep(783.99),
			new Beep(1046.50),
			new Beep(1318.51),
			new Beep(1567.98)
		],
		[
			//BDGB
			// new Beep(61.74),
			// new Beep(73.42),
			// new Beep(98.00),
			new Beep(123.47),
			new Beep(146.83),
			new Beep(196.00),
			new Beep(246.94),
			new Beep(293.66),
			new Beep(392.00),
			new Beep(493.88),
			new Beep(587.33),
			new Beep(783.99),
			new Beep(987.77),
			new Beep(1174.66),
			new Beep(1567.98)
		]
	];

	this.chordIndex = this.beeps.length - 1;

	this.playNote = function(){
		this.beeps[this.chordIndex][this.beepIndex].beep();
		this.beepIndex = (this.beepIndex + 1) % this.beeps[0].length;
	}
	this.playChord = function(){
		for (var i = 0; i < 3; i++) {
			this.beeps[this.chordIndex][i].beep();
		}
		this.chordIndex = (this.chordIndex + 1) % this.beeps.length;
	}
	this.playTopNote = function(){
		this.topBeep.beep();
		this.chordIndex = (this.chordIndex + 1) % this.beeps.length;
	}

}

function mute(){
	muted = !muted;
	if(muted){
		mix.gain.value = 0;
	}
	else{
		mix.gain.value = volume;
	}
}

function setVolume(vol){
	volume = vol;
	mix.gain.value = volume;
}