'use strict'; {
  let b, d, x, y;
  registerProcessor("rnnoise", class extends AudioWorkletProcessor {
    constructor(a) {
      super({ ...a,
        numberOfInputs: 1,
        numberOfOutputs: 1,
        outputChannelCount: [1]
      });
      b || (d = new Float32Array((b = (new WebAssembly.Instance(a.processorOptions.module)).exports).memory.buffer));
      this.state = b.newState(1.0, 0.0);
      this.alive = !0;
      this.port.onmessage = ({ //ポートがメッセージを受信したら
        data: a
      }) => {
        this.alive && (a ? this.port.postMessage({ //生きてて、かつaがポートメッセージだったら、getVadProb じゃなかったらdelete
          vadProb: b.getVadProb(this.state)
        }) : (this.alive = !1, b.deleteState(this.state)))
      }
    }
    //音声処理
    process(a, c, e) {
      if (this.alive) return d.set(a[0][0], b.getInput(this.state) / 4), a = c[0][0], (c = b.pipe(this.state, a.length) / 4) && a.set(d.subarray(c, c + a.length)), !0
    }
  })
};