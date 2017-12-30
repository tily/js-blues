var Bass = function() {
	var freqs = [110, 146, 164, 184, 195, 220, 246, 261, 277, 293]
	this.audio = {}
	this.count = 0
	for(var i = 0; i < freqs.length; i++) {
		var signals = this.createSignals(freqs[i], 44100, 0.1)
		for(var j = 0; j < 5; j++) {
			var audio = this.toAudio(signals.body, signals.length, 44100, 16)
			if(!this.audio[freqs[i]]) this.audio[freqs[i]] = []
			this.audio[freqs[i]].push(audio)
		}
	}
	this.pattern = {
		'A': {
			high: [
				164, null, 164, 184, null, 184,
				195, null, 195, 184, null, 184
			],
			low: [
				110, null, 110, 110, null, 110,
				110, null, 110, 110, null, 110
			]
		},
		'D': {
			high: [
				220, null, 220, 246, null, 246,
				261, null, 261, 246, null, 246
			],
			low: [
				146, null, 146, 146, null, 146,
				146, null, 146, 146, null, 146
			]
		},
		'E': {
			high: [
				246, null, 246, 277, null, 277,
				293, null, 293, 277, null, 277
			],
			low: [
				164, null, 164, 164, null, 164,
				164, null, 164, 164, null, 164
			]
		}
	}
}
Bass.prototype = {
	tick: function(step) {
		var bar = Math.floor(step/12)
		var key = null
		var tones = ['high', 'low']
		if(bar == 1 || bar == 4 || bar == 5 || bar == 9) {
			key = 'D'
		} else if(bar == 8 || bar == 11) {
			key = 'E'
		} else {
			key = 'A'
		}
		for(var i = 0; i < tones.length; i++) {
			var freq = this.pattern[key][tones[i]][step % 12]
			//if(freq) { this.audio[freq][this.count].play(); console.log('play') }
			if(freq) { this.audio[freq][this.count].play() }
			this.count++
			if(this.count > 4) this.count = 0
		}
	},
	// http://hitode909.appspot.com/amen/wavfile.js
	base64encode: function(data) {
	  return btoa(data.replace(/[\u0100-\uffff]/g, function(c) {
	    return String.fromCharCode(c.charCodeAt(0) & 0xff)
	  }))
	},
	// based on http://d.hatena.ne.jp/yanagia/20100323/1269334226
	toAudio: function(signals, length, samplingRate, bitPerSample) {
	        var header,
	            byteNum, formatId, channelNum, bytePerSec, blockSize,
	            audio
	
	        byteNum = String.fromCharCode(16, 0, 0, 0)
	        formatId = String.fromCharCode(1, 0)
	        channelNum = String.fromCharCode(1, 0)
	        samplingRate = String.fromCharCode(
	            (samplingRate >> 0 & 0xFF),
	            (samplingRate >> 8 & 0xFF),
	            (samplingRate >> 16 & 0xFF),
	            (samplingRate >> 24 & 0xFF)
	        )
	        bytePerSec = String.fromCharCode(
	            (samplingRate * bitPerSample / 2 >> 0 & 0xFF),
	            (samplingRate * bitPerSample / 2 >> 8 & 0xFF),
	            (samplingRate * bitPerSample / 2 >> 16 & 0xFF),
	            (samplingRate * bitPerSample / 2 >> 24 & 0xFF)
	        )
	        blockSize = String.fromCharCode(bitPerSample/8, 0)
	        bitPerSample = String.fromCharCode(bitPerSample, 0)
	
	        header = [
	            'RIFF',
	            String.fromCharCode(
	                (36 + length >> 0 & 0xFF),
	                (36 + length >> 8 & 0xFF),
	                (36 + length >> 16 & 0xFF),
	                (36 + length >> 24 & 0xFF)
	            ),
	            'WAVEfmt ', byteNum, formatId, channelNum, samplingRate,
	            bytePerSec, blockSize, bitPerSample, 'data',
	            String.fromCharCode(
	                (length >> 0 & 0xFF),
	                (length >> 8 & 0xFF),
	                (length >> 16 & 0xFF),
	                (length >> 24 & 0xFF)
	            )
	        ].join('')
	
	        audio = new Audio()
	        audio.src = 'data:audio/wav;base64,' + this.base64encode([header, signals].join(''))
	        document.body.appendChild(audio)
	        return audio
	},
	createSignals: function(frequency, samplingRate, duration) {
	        var arr = []
	        var length = samplingRate * duration
	        var increment = 2 * Math.PI * frequency / samplingRate
	        var angle = 0
	        for(var i = 0; i < length; i++) {
	                var sample = Math.floor(Math.sin(angle) * 65535) + 32768
	                arr.push(String.fromCharCode(sample >> 0 & 0xFF))
	                arr.push(String.fromCharCode(sample >> 8 & 0xFF))
	                angle += increment
	        }
	        return {body: arr.join(''), length: length}
	}
}

var Drum = function() {
	// based on http://8beat.me/blues/shuffle_1.php
	this.pattern = {
		'00. Basic': {
			hh:    [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
			snare: [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
			kick:  [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0]
		},
		'01. Heavy': {
			hh:    [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
			snare: [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
			kick:  [1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1]
		},
		'02. Backbeat': {
			hh:    [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
			snare: [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
			kick:  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0]
		},
		'03. Chicago': {
			hh:    [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
			snare: [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
			kick:  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0]
		},
		'04. Backbeat Snare': {
			hh:    [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
			snare: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
			kick:  [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0]
		}
	}
	this.audio = {}
	for(var timbre in this.pattern['00. Basic']) {
		this.audio[timbre] = []
		for(var i = 0; i < 12; i++) {
			var audio = new Audio()
			audio.src = timbre + '.wav'
			document.body.appendChild(audio)
			this.audio[timbre][i] = audio
		}
	}
}
Drum.prototype = {
	tick: function(step) {
		var pattern = this.pattern['04. Backbeat Snare']
		for(var timbre in pattern) {
			if(pattern[timbre][step % 12]) {
				this.audio[timbre][step % 12].play()
			}
		}
	}
}

$(function() {
	var drum = new Drum()
	var bass = new Bass()
	var bpm = 120
	var step = 0
	var getInterval = function(bpm) {
		return bpm / 60 * 1000 / 4 / 3
	}
	$('#score').bind('tick', function(event, step) {
		drum.tick(step)
		bass.tick(step)
	})
	var timer = new Worker('muteki-timer.js')
	timer.onmessage = function() {
		//var newBpm = $('#bpm').val()
		if(step >= 144) step = 0
		$('#score').trigger('tick', step)
		timer.postMessage(getInterval(bpm))
		step++
	}
	timer.postMessage(getInterval(bpm))
})
