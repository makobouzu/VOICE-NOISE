function __log(e, data) {
    console.log(e + " " + (data || ''));
}

var audio_context;
var recorder;
var gainNode;
var recNum = 0;
document.getElementById("complete").style = "display: none;";
var now = new Date();

function inputSound(button) {
    button.disabled = true;
    document.getElementById("stop").disabled = false;
    document.getElementById("upload").disabled = false;
    document.getElementById("progress").style = "width: 0%;";
    document.getElementById("progress").innerHTML = "0%";
    document.getElementById("complete").style = "display: none;";
    if(recNum == 0){
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            if (navigator.mediaDevices === undefined) {
              navigator.mediaDevices = {};
            }
            if (navigator.mediaDevices.getUserMedia === undefined) {
                navigator.mediaDevices.getUserMedia = function(constraints) {
                    let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                    if (!getUserMedia) {
                        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
                    }
                    return new Promise(function(resolve, reject) {
                        getUserMedia.call(navigator, constraints, resolve, reject);
                    });
                }
            }
            window.URL = window.URL || window.webkitURL;
      
            audio_context = new AudioContext({sampleRate: 48000});
            __log('Audio context set up.');
            __log('navigator.mediaDevices ' + (navigator.mediaDevices.length != 0 ? 'available.' : 'not present!'));
            RNNoiseNode.register(audio_context);
          } catch (e) {
            alert('No web audio support in this browser!');
            alert("このブラウザは対応していません。Safariをご利用ください。");
          }
          
          navigator.mediaDevices.getUserMedia({
              audio: {
                  channelCount: { ideal: 1 },
                  noiseSuppression: { ideal: false },
                  echoCancellation: { ideal: true },
                  autoGainControl: { ideal: false },
                  sampleRate: { ideal: 48000 }
              }
          })
          .then(function(stream) {
              startUserMedia(stream);
          })
          .catch(function(e) {
              __log('No live audio input: ' + e);
              alert("オーディオの入力が取得できませんでした。もう一度リロードしてください。");
          })
          .then(function(){
              gainNode.gain.value = 1;
              __log('Sound Input...');
              recNum = 1;
          });
    }else{
        gainNode.gain.value = 1;
        __log('Sound Input...');
    }
}

function startRecording(button) {
    button.disabled = true;
    button.nextElementSibling.disabled = false;
    document.getElementById("upload").disabled = false;
    document.getElementById("progress").style = "width: 0%;";
    document.getElementById("progress").innerHTML = "0%";
    document.getElementById("complete").style = "display: none;";

    if(recNum == 0){
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            if (navigator.mediaDevices === undefined) {
              navigator.mediaDevices = {};
            }
            if (navigator.mediaDevices.getUserMedia === undefined) {
                navigator.mediaDevices.getUserMedia = function(constraints) {
                    let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                    if (!getUserMedia) {
                        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
                    }
                    return new Promise(function(resolve, reject) {
                        getUserMedia.call(navigator, constraints, resolve, reject);
                    });
                }
            }
            window.URL = window.URL || window.webkitURL;
      
            audio_context = new AudioContext({sampleRate: 48000});
            __log('Audio context set up.');
            __log('navigator.mediaDevices ' + (navigator.mediaDevices.length != 0 ? 'available.' : 'not present!'));
            RNNoiseNode.register(audio_context);
          } catch (e) {
            __log('No web audio support in this browser!');
            alert("このブラウザは対応していません。Safariをご利用ください。");
          }
          
          navigator.mediaDevices.getUserMedia({
              audio: {
                  channelCount: { ideal: 1 },
                  noiseSuppression: { ideal: false },
                  echoCancellation: { ideal: true },
                  autoGainControl: { ideal: false },
                  sampleRate: { ideal: 48000 }
              }
          })
          .then(function(stream) {
              startUserMedia(stream);
          })
          .catch(function(e) {
              __log('No live audio input: ' + e);
              alert("オーディオの入力が取得できませんでした。もう一度リロードしてください。");
          })
          .then(function(){
              recorder && recorder.record();
              document.getElementById("start").style = "color: red;";
              gainNode.gain.value = 1;
              recNum = 1;
              __log('Recording...');
          });
    }else{
        recorder.clear();
        recorder && recorder.record();
        document.getElementById("start").style = "color: red;";
        gainNode.gain.value = 1;
        __log('Recording...');
    }
};

function stopRecording(button) {
    recorder && recorder.stop();
    button.disabled = true;
    button.previousElementSibling.disabled = false;
    document.getElementById("sound").disabled = false;
    document.getElementById("start").style = "color: black;";
    if(typeof gainNode === "undefined"){
        return;
    }else{
        gainNode.gain.value = 0;
    }
    __log('Stopped recording.');
    recNum = 1;
}

function updateNoise(rnnoise){
	try{
        (function a() {
            requestAnimationFrame(() => {
                rnnoise.update(true);
				a();
            });
        })();

        document.getElementById("noise").addEventListener("input", async () => {
            var noise = Math.round(document.getElementById("noise").value * 10) / 10;
            var voice = Math.round((1 - noise) * 10) / 10;
			rnnoise.change(voice, noise);
            __log("Voice: "+ voice +" - Noise: " + noise);   
		});
    } catch (e) {
        context.close();
        console.error(e);
        alert("RNNoiseの処理がアップデートできませんでした。");
	}
}

function uploadRecording(button) {
    button.disabled = true;
    const name = new Date().toISOString();
    const dbName = document.getElementById("db_filename").value;
    let lng, lat, path;
    if(dbName === ""){
        alert("音声ファイルに名前をつけてください。");
        button.disabled = false;
        return;
    }
    //検索結果 or GPSのデータを使用する場合
    if((typeof geoLocate._lastKnownPosition === "undefined") && (typeof geocoder_lng === "undefined")){
        console.log("no value of lng & lat");
        alert("現在地をオンにするか、対象とする地点を検索してください。");
        console.log(dbName);
        button.disabled = false;
        return;
    }
    if(typeof geocoder_lng != "undefined"){
        lng = geocoder_lng;
        lat = geocoder_lat;
    }
    if(typeof geoLocate._lastKnownPosition != "undefined"){
        lng = geoLocate._lastKnownPosition.coords.longitude;
        lat = geoLocate._lastKnownPosition.coords.latitude;
    }

    recorder && recorder.exportWAV(function(blob) {
        const blobUrl = URL.createObjectURL(blob);

        const file = new File([blob], name.valueOf(),{ type:"audio/wav" })
        let fileName = file.name;
        let fileType = file.type;

        axios.post("/sign_s3",{
            fileName : fileName,
            fileType : fileType
        })
        .then(response => {
            var returnData = response.data.data.returnData;
            var signedRequest = returnData.signedRequest;
            var url = returnData.url;
            var options = {
                headers: {
                    'Content-Type': fileType,
                }
            };
            axios.put(signedRequest,file,options)
            .then(result => {
                __log("audio uploaded")
                console.log(result);
                path = result.config.url;
                dbUpload(dbName, lng, lat, path);
                document.getElementById("close").disabled = false;
            })
            .catch(error => {
                alert("ERROR " + JSON.stringify(error));
            })
        })
        .catch(error => {
            __log(JSON.stringify(error));
        });
    });
    recorder.clear();
}

//------------------detail
function reload(button){
    if(document.getElementById("progress").innerHTML === "0%"){
        console.log("");
    }else if(document.getElementById("progress").innerHTML === "100%"){
        location.reload(true);
    }
}

function startUserMedia(stream) {
    var input = audio_context.createMediaStreamSource(stream);
    rnnoise = new RNNoiseNode(audio_context);
    gainNode = audio_context.createGain();
	input.connect(rnnoise);
    audio_context.resume();
    __log('Media stream created.');

    rnnoise.connect(gainNode);
    gainNode.connect(audio_context.destination);
	updateNoise(rnnoise);
    __log('Input connected to audio context destination.');

    recorder = new Recorder(rnnoise);
    __log('Recorder initialised.');
    __log("Voice: 1.0 - Noise: 0.0");
}

function dbUpload(dbName, lng, lat, path) {
    const dbData = new URLSearchParams();
    dbData.append("name", dbName);
    dbData.append("location", "(" + lng + "," + lat + ")");
    // dbData.append("path", "audio/" + name + ".wav");
    dbData.append("path", path);
    dbData.append("num", 0);
    const dbHead = {
        method: 'post',
        data: dbData,
        'Content-Type': 'multipart/form-data'
    };
    axios.post("/sound", dbData, {
        header: dbHead,
        onUploadProgress: function (progressEvent) {
            var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            document.getElementById("progress").style = "width: " +  percentCompleted + "%;";
            document.getElementById("progress").innerHTML = percentCompleted + "%";
            document.getElementById("close").disabled = true;
        }
    })
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
        alert("データベースのアクセスに失敗しました。");
    });
}
    