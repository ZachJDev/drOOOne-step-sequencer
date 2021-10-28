
let merger = audioCtx.createChannelMerger()
let masterGain = audioCtx.createGain()
masterGain.gain.setValueAtTime(.1, audioCtx.currentTime)
masterGain.connect(audioCtx.destination)
merger.connect(masterGain)
class GainManager {
    constructor(context, val = 0.1) {
        this.gain = new GainNode(context, {gain: val})
        this.gain.connect(merger)
        // this.gain.connect(audioCtx.destination)
        this.context = context
    }
    setVal(val) {
        // this.gain.gain.value = val
        this.gain.gain.setValueAtTime(val,this.context.currentTime)
    }
}

class OscillatorManager {
    constructor(context, freq=440, oscillator = null, gainVal = 0) {
        this.oscillator = oscillator;
        this.freq = freq;
        this.context = context;
        this.gainManager = new GainManager(this.context, gainVal)
        this.type = 'sine'
    }

    setType(value)  { // Changes the type of oscillator
        try {
            if(!['square', 'sawtooth', 'sine', 'triangle'].includes(value))
            {
                throw new Error('Cannot set oscillator to type ' + value)
            }
            this.type = value
            if(this.oscillator) {
                this.oscillator.type = value;
            }
        } catch (e) {
            console.log(e)
        }

}
    setFreq (value) {
        this.freq = value
        if(this.oscillator) {
            try {
                this.oscillator.frequency.setValueAtTime(this.freq, this.context.currentTime)
            } catch (e) { } //  fail silently when the text input is empty
        }
    }
    setOsc (frequency = this.freq, type = this.type) {
        this.oscillator = new OscillatorNode(audioCtx, {frequency, type})
        this.oscillator.connect(this.gainManager.gain);
        return this.oscillator
    }

    setGain(val) {
        this.gainManager.setVal(val)
    }
    removeOsc() {
        this.oscillator.disconnect(this.gainManager.gain)
        this.oscillator = null;
    }
}


class Circle {
    constructor(x, y, optionsContext) {
        this.optionsContext = optionsContext;
        this.x = x; this.y = y;
        this.growing = true;
        this.diameter = 1;
        this.freq = this.computeFreq()
        this.fillColor = color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256))
        this.strokeColor = color(255,255,255)
        this.osc = new OscillatorManager(audioCtx, this.freq);
        this.osc.setOsc().start();
      }

      computeFreq() {
        this.freq = Math.floor(((Math.abs(height - this.y) / height) * this.optionsContext.maxFreq) + this.optionsContext.minFreq)
      }
      
      draw(strokeCircles, percent = 0) {
        if(this.growing) {
          this.diameter+= 2
        }
        this.fillColor.setAlpha(Math.floor(percent * 100))
        fill(this.fillColor)
        this.fillColor.setAlpha(100)
       if(strokeCircles) {
        stroke(this.fillColor)
       } else {
           noStroke()
       }
        
        circle(this.x,this.y, this.diameter);
      }

      play(val, time) {
          this.osc.setFreq(this.freq )
          this.osc.setGain(val, time)
      }
      stop() {
          this.osc.setGain(0)
      }

      get radius() {
          return this.diameter / 2
      }
      
      get leftBound() {
          return  this.x - this.radius
      }

      get rightBound() {
        return  this.x + this.radius
      }
}

