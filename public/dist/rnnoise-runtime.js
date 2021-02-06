'use strict'; {
  const g = document.currentScript.src.match(/(.*\/)?/)[0],
    h = (WebAssembly.compileStreaming || (async a1 => await WebAssembly.compile(await (await a1).arrayBuffer())))(fetch("dist/rnnoise-processor_bird.wasm"));//wasmファイル選択
  let k, c, e;

  window.RNNoiseNode = (window.AudioWorkletNode || (window.AudioWorkletNode = window.webkitAudioWorkletNode)) && class extends AudioWorkletNode {

    static async register(a) {
      k = await h;
      console.log("register: " + k)
      await a.audioWorklet.addModule("dist/rnnoise-processor.js");
    }

    constructor(a) {
      super(a, "rnnoise", {
        channelCountMode: "explicit",
        channelCount: 1,
        channelInterpretation: "speakers",
        numberOfInputs: 1,
        numberOfOutputs: 1,
        outputChannelCount: [1],
        processorOptions: {
          module: k
        }
      });
      this.port.onmessage = ({
        data: b
      }) => {
        b = Object.assign(new Event("status"), b);
        this.dispatchEvent(b);
        if (this.onstatus) this.onstatus(b)
      }
    }

    update(a) {
      this.port.postMessage(a)
    }

    change(m, n) {
      this.port.postMessage({
        voice: m,
        noise: n
      });
    }

  } || (window.ScriptProcessorNode || (window.ScriptProcessorNode = window.webkitScriptProcessorNode)) && Object.assign(function (a) {
    const b = a.createScriptProcessor(512, 1, 1);
    const d = c.newState(0.5, 0.5);
    let f = !0;
    b.onaudioprocess = ({
      inputBuffer: b,
      outputBuffer: a
    }) => {
      f && (e.set(b.getChannelData(0), c.getInput(d) / 4), b = a.getChannelData(0), (a = c.pipe(d, b.length) / 4) && b.set(e.subarray(a, a + b.length)))
    };

    b.update = a => {
      if (f){
        if (a) {
          if (a = Object.assign(new Event("status"), {
              vadProb: c.getVadProb(d)
            }), b.dispatchEvent(a), b.onstatus) b.onstatus(a)
        } else {
          f = !1, c.deleteState(d)
        }
      }
    };

    b.change = (m,n) =>{
      if(f){
        c.updateState(d, m, n);
      }
    }
    return b
  }, {
    register: async() => {
      c || (e = new Float32Array((c = (await WebAssembly.instantiate(await h)).exports).memory.buffer));
    }
  })
};
