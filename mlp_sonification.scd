(
s.reboot;
s.waitForBoot {
    TempoClock.default.tempo = 120/60;
    "▶ Debug Sonification Starting at 40 BPM".postln;

	~scale = [0, 2, 3, 5, 7, 8, 10];

	~quant = { |midiNote|
		var octave      = (midiNote / 12).floor;       // octave
		var degree      = midiNote % 12;               // 0–11
		var nearestDeg  = ~scale.minItem({ |d|     // pick the scale degree
			(d - degree).abs                           // with smallest distance
		});
		(octave * 12) + nearestDeg;                    // rebuild full MIDI number
	};

    // Example data
    ~h1=[0.23,0,0.14,0,0,0.28,0,0,0,0,0,0.18,0.78,0,0,0,0.49,0,0,0,0,0.13,0,0,2.02,0,0.42,0,0,0.46,0,0,1.18,0,0,0,0,1.16,0,0,0.3,0,0,0.79,0,0,0,1.02,0,0,0,0,2.29,0.24,0,0,0,0.14,0.5,0.49,0.39,0,0,0,0.78,0.05,0,0,0,0,0,0,0,0,0,0,0.18,0,0.97,0.83,0,0,0.97,0,0.43,1.12,0.44,0,0,0.28,0,0,0,0,0,0,0.32,1.64,0.82,0.01,0.43,0,0.32,0.01,0,0,1.03,0,0,0,0,0,0,0,0.1,0,0.77,0,0,0,0.09,0,0,0.17,0,0,1.21,0];
    ~h2  = [2.06,0.16,0,0,3.01,0,0,2.73,3.57,0.25,2.27,0,2.28,0,0,0];
    ~out = [0,0,0.01,0.03,0,0,0,0.9,0,0.05];

	OSCdef(\h1def, { |msg|
        ~h1 = msg.drop(1);
        ("⟹ /hidden1 ← " ++ ~h1.size ++ " values").postln;
    }, '/hidden1');

    OSCdef(\h2def, { |msg|
        ~h2 = msg.drop(1);
        ("⟹ /hidden2 ← " ++ ~h2.size ++ " values").postln;
    }, '/hidden2');

    OSCdef(\outdef, { |msg|
        ~out = msg.drop(1);
        ("⟹ /output  ← " ++ ~out.size ++ " values").postln;
    }, '/output');

    // SynthDefs
    SynthDef(\pad, { |out=0, freq=440, amp=0.4|
		var env = EnvGen.kr(Env.linen(0.5, 1.2, 0.5), doneAction:2);
		var sig = SinOsc.ar(freq) * amp;
		Out.ar(out, LPF.ar(sig, 2000) * env ! 2);
	}).add;

	SynthDef(\lead, { |out=0, freq=440, amp=0.3|
		var lfoRate = LFNoise1.kr(0.1).range(0.1, 2);
		var lfo     = LFTri.kr(lfoRate);
		var cutoff  = lfo.range(300, 2000);
		var atk  = lfo.range(0.001, 0.03);
		var env     = EnvGen.kr(Env.perc(atk, 1.5), doneAction:2);
		var tone    = SinOsc.ar(freq) + (SinOsc.ar(freq * 2.01) * 0.4);
		var sig     = RLPF.ar(tone * env * amp, cutoff - (env * 500), 0.99);

		Out.ar(out, sig!2);
	}).add;


    "▶ SynthDefs loaded: \\pad and \\lead".postln;

	~scale0 = Buffer.loadCollection(s, Scale.minorPentatonic.degrees);

    // Pad Routine
	Routine({
		loop {
			"— pad tick".postln;
			~h1.do({ |v,i|
				Synth(\pad, [
					\freq, ~quant.(i).midicps,
					\amp,  v * 0.002
				]);
			});
			~h2.do({ |v,i|
				Synth(\pad, [
					\freq, ~quant.(i + 36).midicps,
					\amp,  v * 0.001
				]);
			});
			rrand(4, 5).wait;
		}
	}).play;

    // Melody Routine
	//Monophonic
/*    Routine({
        loop {
            "— lead tick".postln;
            Synth(\lead, [
				\freq, (~quant.((~out.indexOf(~out.maxItem)) + 60)).midicps,
                \amp,  ~out.maxItem * 0.3
            ]);
            1.wait;  // one beat
        }
    }).play;*/
	//Ploy
	Routine({
		loop {
			"— lead tick".postln;
			~h1.do({ |v,i|
				Synth(\lead, [
					\freq, ~quant.(i + 24).midicps,
					\amp,  v * 0.02
				]);
			});
			rrand(0.1, 1.1).wait;  // one beat
		}
	}).play;

    "▶ Routines running—listen for pad & lead!".postln;
};
)