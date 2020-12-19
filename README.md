# VOICE-NOISE
[![](https://img.shields.io/badge/Safari-Passing-gre.svg?logo=Safari&style=plastic)]() [![](https://img.shields.io/badge/Chrome-Failed-red.svg?logo=Google%20Chrome&style=plastic)]() [![](https://img.shields.io/badge/Firefox-Failed-red.svg?logo=Firefox&style=plastic)]()


"VOICE | NOISE" is a sound mapping and recording tool using RNNoise, Recorder.js, and mapbox.  

[https://www.voice-noise.com](https://www.voice-noise.com)

## Install
```sh:fish
git clone git@github.com:makobouzu/VOICE-NOISE.git
cd VoiceNoise
npm install
```

## Demo
You need to create a .env file and database with a postgresql.  

```sh:fish
cd VoiceNoise
npm run devStart
```
![preview](img/preview.png "preview")

## Reference

* [RNNoise](https://github.com/xiph/rnnoise "RNNoise")
* [sysprog21/rnnoise](https://github.com/sysprog21/rnnoise "RNNoise_sample")
* [wegylexy/rnnoise_wasm](https://github.com/wegylexy/rnnoise_wasm "rnnoise_wasm")
* [s1r-J/Recorderjs](https://github.com/s1r-J/Recorderjs "Recorder.js")
* [mapbox](https://www.mapbox.com/ "mapbox")

> Copyright (c) 2017, Mozilla  
Copyright (c) 2007-2017, Jean-Marc Valin  
Copyright (c) 2005-2017, Xiph.Org Foundation  
Copyright (c) 2003-2004, Mark Borgerding  
