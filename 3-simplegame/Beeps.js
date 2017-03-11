//Provides various C chords, using the Web Audio API and Beep.js
function Beeps(audioNodeAbove, context)
{
	var beepIndex = 0;
	var chordIndex;

	var topBeep = new Beep(1046.00, audioNodeAbove, context);
	// beeps represents an array of chords, where beeps[i] represents a chord, and beeps[i][j] represents a note within a chord
	// note: the first octave (<100 Hz) can't be played on laptop speakers, but do show up via earbuds/speakers
	var beeps =
	[
		[
			//CEGC
			// new Beep(65.41, audioNodeAbove, context),
			// new Beep(82.41, audioNodeAbove, context),
			// new Beep(98.00, audioNodeAbove, context),
			new Beep(130.81, audioNodeAbove, context),
			new Beep(164.81, audioNodeAbove, context),
			new Beep(196.00, audioNodeAbove, context),
			new Beep(261.63, audioNodeAbove, context),
			new Beep(329.63, audioNodeAbove, context),
			new Beep(392.00, audioNodeAbove, context),
			new Beep(523.25, audioNodeAbove, context),
			new Beep(659.25, audioNodeAbove, context),
			new Beep(783.99, audioNodeAbove, context),
			new Beep(1046.50, audioNodeAbove, context),
			new Beep(1318.51, audioNodeAbove, context),
			new Beep(1567.98, audioNodeAbove, context)
		],
		[
			//CFAC
			// new Beep(65.41, audioNodeAbove, context),
			// new Beep(87.31, audioNodeAbove, context),
			// new Beep(110.00, audioNodeAbove, context),
			new Beep(130.81, audioNodeAbove, context),
			new Beep(174.61, audioNodeAbove, context),
			new Beep(220.00, audioNodeAbove, context),
			new Beep(261.63, audioNodeAbove, context),
			new Beep(349.23, audioNodeAbove, context),
			new Beep(440.00, audioNodeAbove, context),
			new Beep(523.25, audioNodeAbove, context),
			new Beep(698.46, audioNodeAbove, context),
			new Beep(880.00, audioNodeAbove, context),
			new Beep(1046.50, audioNodeAbove, context),
			new Beep(1396.91, audioNodeAbove, context),
			new Beep(1760.00, audioNodeAbove, context)
		],
		[
			//CEGC
			// new Beep(65.41, audioNodeAbove, context),
			// new Beep(82.41, audioNodeAbove, context),
			// new Beep(98.00, audioNodeAbove, context),
			new Beep(130.81, audioNodeAbove, context),
			new Beep(164.81, audioNodeAbove, context),
			new Beep(196.00, audioNodeAbove, context),
			new Beep(261.63, audioNodeAbove, context),
			new Beep(329.63, audioNodeAbove, context),
			new Beep(392.00, audioNodeAbove, context),
			new Beep(523.25, audioNodeAbove, context),
			new Beep(659.25, audioNodeAbove, context),
			new Beep(783.99, audioNodeAbove, context),
			new Beep(1046.50, audioNodeAbove, context),
			new Beep(1318.51, audioNodeAbove, context),
			new Beep(1567.98, audioNodeAbove, context)
		],
		[
			//BDGB
			// new Beep(61.74, audioNodeAbove, context),
			// new Beep(73.42, audioNodeAbove, context),
			// new Beep(98.00, audioNodeAbove, context),
			new Beep(123.47, audioNodeAbove, context),
			new Beep(146.83, audioNodeAbove, context),
			new Beep(196.00, audioNodeAbove, context),
			new Beep(246.94, audioNodeAbove, context),
			new Beep(293.66, audioNodeAbove, context),
			new Beep(392.00, audioNodeAbove, context),
			new Beep(493.88, audioNodeAbove, context),
			new Beep(587.33, audioNodeAbove, context),
			new Beep(783.99, audioNodeAbove, context),
			new Beep(987.77, audioNodeAbove, context),
			new Beep(1174.66, audioNodeAbove, context),
			new Beep(1567.98, audioNodeAbove, context)
		]
	];

	chordIndex = beeps.length - 1;

	this.playNote = function(){
		beeps[chordIndex][beepIndex].beep();
		beepIndex = (beepIndex + 1) % beeps[0].length;
	}
	this.playChord = function(){
		for (var i = 0; i < 3; i++) {
			beeps[chordIndex][i].beep();
		}
	}
	this.playTopNote = function(){
		topBeep.beep();
	}
	this.nextChord = function(){
		chordIndex = (chordIndex + 1) % beeps.length;
	}
	this.reset = function(){
		chordIndex = 0;
		beepIndex = 0;
	}
}