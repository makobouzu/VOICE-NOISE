'use strict'; {
  let b, d;
  registerProcessor("rnnoise", class extends AudioWorkletProcessor {
    constructor(a) {
      super({ ...a,
        numberOfInputs: 1,
        numberOfOutputs: 1,
        outputChannelCount: [1]
      });
      b || (d = new Float32Array((b = (new WebAssembly.Instance(a.processorOptions.module)).exports).memory.buffer));
      this.state = b.newState(0.5, 0.5);
      this.alive = !0;
      this.port.onmessage = ({
        data: a
      }) => {
        this.alive && (a ? this.port.postMessage({
          vadProb: b.getVadProb(this.state)
        }) : (this.alive = !1, b.deleteState(this.state)))
      }

      this.port.onmessage = ({
        data: a
      }) => {
        if(this.alive){
          if(typeof a.voice != "undefined" && typeof a.noise != "undefined"){
            b.updateState(this.state, a.voice, a.noise);
          }
        }
      }
    }

    process(a, c) {
      if (this.alive) return d.set(a[0][0], b.getInput(this.state) / 4), a = c[0][0], (c = b.pipe(this.state, a.length) / 4) && a.set(d.subarray(c, c + a.length)), !0
    }
  });
};