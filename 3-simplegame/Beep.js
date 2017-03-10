//Provides a "beep" sound, mimicing a piano note, using the Web Audio API.
function Beep(frequency, audioNodeAbove, context)
{	
	var wave = "sine";
	var minimumAmplitude = 0.00001;
	var maximumAmplitude = .3;
	var attack = .01;
	var release = 3;

	var oscillator = null;
	var gain = null;

	function beepSetup(){
		oscillator = context.createOscillator();
		oscillator.frequency.value = frequency;
		oscillator.type = wave;
		oscillator.start(context.currentTime);

		gain = context.createGain();
		oscillator.connect(gain);

		gain.gain.value = minimumAmplitude;
		gain.connect(audioNodeAbove);
	}

	function beepTearDown(){
		oscillator = null;
		gain = null;
	}

	beepSetup();

	this.beep = function(){
		gain.gain.exponentialRampToValueAtTime(maximumAmplitude, context.currentTime + attack);
		gain.gain.exponentialRampToValueAtTime(minimumAmplitude, context.currentTime + attack + release);	

		oscillator.stop(context.currentTime + attack + release);	
		
		beepTearDown();	//due to oscillators being single-use objects (I think this was bad design of the audio API, but meh)
		beepSetup();
	}

	this.changeFrequency = function(newFrequency){
		beepTearDown();
		frequency = newFrequency;
		beepSetup();
	}
}