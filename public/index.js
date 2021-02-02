function __log(e, data) {
    console.log(e + " " + (data || ''));
}

var audio_context;
var rnnoise;
var gainNode;
var num = 0;
document.getElementById("complete").style = "display: none;";
var now = new Date();
localStorage.setItem('time1', 'First');

window.onload = function init(){
    document.getElementById("slider").style = "opacity: 1.0;";
    document.getElementById("voice-noise").disabled = false;
    document.getElementById("upload").disabled = false;
    document.getElementById("progress").style = "width: 0%;";
    document.getElementById("progress").innerHTML = "0%";
    document.getElementById("complete").style = "display: none;";

    if(localStorage.getItem('time2') === null){
        document.getElementById("info").click();
        localStorage.setItem('time2', 'Second');   
    }

    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        audio_context = new AudioContext({sampleRate: 48000});
        __log('Audio context set up.');
        RNNoiseNode.register(audio_context);
    } catch (e) {
        alert("このブラウザは対応していません。Safariをご利用ください。\nNo web audio support in this browser. Please use Safari.");
    }
}

function audioConnect(){
    if(num === 0){
        console.log("audioConnect!!")
        var audioSamples = document.querySelector('audio');
        var input = audio_context.createMediaElementSource(audioSamples);
        rnnoise = new RNNoiseNode(audio_context);
        gainNode = audio_context.createGain();
        gainNode.gain.value = 1;
	    input.connect(rnnoise);
        audio_context.resume();
        __log('Media stream created.');

        rnnoise.connect(gainNode);
        gainNode.connect(audio_context.destination);
        __log('Input connected to audio context destination.');
    }
    num += 1;
	updateNoise(rnnoise);
    __log("Voice: 0.5 - Noise: 0.5");
}

function audioPlay(){
    updateNoise(rnnoise);
}
// function startUserMedia(stream) {
//     var input = audio_context.createMediaElementSource(stream);
//     rnnoise = new RNNoiseNode(audio_context);
//     gainNode = audio_context.createGain();
//     gainNode.gain.value = 1;
// 	input.connect(rnnoise);
//     audio_context.resume();
//     __log('Media stream created.');

//     rnnoise.connect(gainNode);
//     gainNode.connect(audio_context.destination);
// 	updateNoise(rnnoise);
//     __log('Input connected to audio context destination.');
//     __log("Voice: 0.5 - Noise: 0.5");
// }

// function inputSound(button) {
//     gtag('event', 'mic_click', {
//         'event_label': 'mic_on',
//         'event_category': 'mic_on',
//         'non_interaction': true
//     });
//     document.getElementById("slider").style = "opacity: 1.0;";
//     document.getElementById("voice-noise").disabled = false;
//     document.getElementById("stop").disabled = false;
//     document.getElementById("upload").disabled = false;
//     document.getElementById("progress").style = "width: 0%;";
//     document.getElementById("progress").innerHTML = "0%";
//     document.getElementById("complete").style = "display: none;";

//     if(recNum == 0){
//         try {
//             window.AudioContext = window.AudioContext || window.webkitAudioContext;
//             if (navigator.mediaDevices === undefined) {
//               navigator.mediaDevices = {};
//             }
//             if (navigator.mediaDevices.getUserMedia === undefined) {
//                 navigator.mediaDevices.getUserMedia = function(constraints) {
//                     let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
//                     if (!getUserMedia) {
//                         return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
//                     }
//                     return new Promise(function(resolve, reject) {
//                         getUserMedia.call(navigator, constraints, resolve, reject);
//                     });
//                 }
//             }
//             window.URL = window.URL || window.webkitURL;
      
        //     audio_context = new AudioContext({sampleRate: 48000});
        //     __log('Audio context set up.');
        //     __log('navigator.mediaDevices ' + (navigator.mediaDevices.length != 0 ? 'available.' : 'not present!'));
        //     RNNoiseNode.register(audio_context);
        //   } catch (e) {
        //     alert("このブラウザは対応していません。Safariをご利用ください。\nNo web audio support in this browser. Please use Safari.");
        //   }
          
//           navigator.mediaDevices.getUserMedia({
//               audio: {
//                   channelCount: { ideal: 1 },
//                   noiseSuppression: { ideal: false },
//                   echoCancellation: { ideal: true },
//                   autoGainControl: { ideal: false },
//                   sampleRate: { ideal: 48000 }
//               }
//           })
//           .then(function(stream) {
//               startUserMedia(stream);
//               document.getElementById("sound").style = "color: limegreen;";
//               gainNode.gain.value = 1;
//               __log('Sound Input...');
//               recNum = 1;
//               volNum = 1;
//           })
//           .catch(function(e) {
//               __log('No live audio input: ' + e);
//               alert("オーディオの入力が取得できませんでした。もう一度リロードしてください。\nCould not get audio input. Please reload again.");
//               document.getElementById("sound").style = "color: black;";
//               return;
//           });
//     }else{
//         if(volNum === 0){
//             document.getElementById("sound").style = "color: limegreen;";
//             gainNode.gain.value = 1;
//             __log('Volume up...');
//             volNum = 1;
            
//         }else if(volNum === 1){
//             document.getElementById("sound").style = "color: black;";
//             gainNode.gain.value = 0;
//             __log('Volume down...');
//             volNum = 0;
//         }
//     }
// }

// function startRecording(button) {
//     gtag('event', 'rec_click', {
//         'event_label': 'rec_on',
//         'event_category': 'rec_on',
//         'non_interaction': true
//     });
//     document.getElementById("slider").style = "opacity: 1.0;";
//     document.getElementById("voice-noise").disabled = false;
//     button.nextElementSibling.disabled = false;
//     document.getElementById("upload").disabled = false;
//     document.getElementById("progress").style = "width: 0%;";
//     document.getElementById("progress").innerHTML = "0%";
//     document.getElementById("complete").style = "display: none;";

//     if(recNum == 0){
//         try {
//             window.AudioContext = window.AudioContext || window.webkitAudioContext;
//             if (navigator.mediaDevices === undefined) {
//               navigator.mediaDevices = {};
//             }
//             if (navigator.mediaDevices.getUserMedia === undefined) {
//                 navigator.mediaDevices.getUserMedia = function(constraints) {
//                     let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
//                     if (!getUserMedia) {
//                         return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
//                     }
//                     return new Promise(function(resolve, reject) {
//                         getUserMedia.call(navigator, constraints, resolve, reject);
//                     });
//                 }
//             }
//             window.URL = window.URL || window.webkitURL;
      
//             audio_context = new AudioContext({sampleRate: 48000});
//             __log('Audio context set up.');
//             __log('navigator.mediaDevices ' + (navigator.mediaDevices.length != 0 ? 'available.' : 'not present!'));
//             RNNoiseNode.register(audio_context);
//           } catch (e) {
//             alert("このブラウザは対応していません。Safariをご利用ください。\nNo web audio support in this browser. Please use Safari.");
//           }
          
//           navigator.mediaDevices.getUserMedia({
//               audio: {
//                   channelCount: { ideal: 1 },
//                   noiseSuppression: { ideal: false },
//                   echoCancellation: { ideal: true },
//                   autoGainControl: { ideal: false },
//                   sampleRate: { ideal: 48000 }
//               }
//           })
//           .then(function(stream) {
//               startUserMedia(stream);
//               document.getElementById("sound").style = "color: limegreen;";
//               gainNode.gain.value = 1;
//               __log('Sound Input...');
//               recNum = 1;
//               volNum = 1;
//               button.disabled = true;
//               recorder && recorder.record();
//               document.getElementById("start").style = "color: red;";
//               recNum = 1;
//               __log('Recording...');
//           })
//           .catch(function(e) {
//               __log('No live audio input: ' + e);
//               alert("オーディオの入力が取得できませんでした。もう一度リロードしてください。\n Could not get audio input. Please reload again.");
//               document.getElementById("sound").style = "color: black;";
//               return;
//           });
//     }else{
//         if(volNum === 0){
//             document.getElementById("sound").style = "color: limegreen;";
//             gainNode.gain.value = 1;
//             volNum = 1;
//         }
//         button.disabled = true;
//         recorder && recorder.record();
//         document.getElementById("start").style = "color: red;";
//         recNum = 1;
//         __log('Recording...');
//     }
// };

// function stopRecording(button) {
//     gtag('event', 'stop_click', {
//         'event_label': 'stop_on',
//         'event_category': 'stop_on',
//         'non_interaction': true
//     });
//     recorder && recorder.stop();
//     button.disabled = true;
//     button.previousElementSibling.disabled = false;
//     document.getElementById("start").style = "color: black;";
//     __log('Stopped recording.');
//     recNum = 1;
// }

function uploadRec() {
    gtag('event', 'submit_click', {
        'event_label': 'data_preview_on',
        'event_category': 'data_preview_on',
        'non_interaction': true
    });
    document.getElementById("download").disabled = false;
    document.getElementById("refresh").disabled = false;
    const sample = document.getElementById("sample");
    if(sample != null){
        audio_comfirm.removeChild(sample);
    }
}

function audioForm(){
    var files = document.getElementById("audioform");
    var audio = document.createElement('audio');
    var audioComfirm = document.getElementById("audio_comfirm");

    const file = URL.createObjectURL(files.files[0]);
    audio.controls = true;
    audio.src = file;
    audio.id = "sample"
    audioComfirm.appendChild(audio);
}

document.getElementById("download").addEventListener('click', () => download());
function download(){
    document.getElementById("download").disabled = true;
    gtag('event', 'download_click', {
        'event_label': 'download_on',
        'event_category': 'download_on',
        'non_interaction': true
    });

    var url = document.getElementById("sample").src;
    var hf = document.createElement('a');
    var name = document.getElementById("db_filename").value;
    if(name === ""){
        alert("音声ファイルに名前をつけてください。\nGive a name to the audio file.");
        document.getElementById("download").disabled = false;
        return;
    }
    hf.href = url;
    hf.download = name + '.wav';
    hf.click();
    document.getElementById("download").disabled = false;
}

function refresh(button){
    gtag('event', 'refresh_click', {
        'event_label': 'refresh_on',
        'event_category': 'refresh_on',
        'non_interaction': true
    });

    document.getElementById("audioform").value = "";
    document.getElementById("audio_comfirm").removeChild(document.getElementById("sample"));

    document.getElementById("download").disabled = true;
    if(document.getElementById("progress").innerHTML === "0%"){
        button.disabled = false;
    }else if(document.getElementById("progress").innerHTML === "100%"){
        button.disabled = true;
    }else{
        button.disabled = true;
    }
}

function reload(button){
    if(document.getElementById("progress").innerHTML === "100%"){
        location.reload(false);
    }
}

function uploadRecording(button) {
    gtag('event', 'upload_click', {
        'event_label': 'upload_on',
        'event_category': 'upload_on',
        'non_interaction': true
    });
    button.disabled = true;
    document.getElementById("download").disabled = true;
    document.getElementById("refresh").disabled = true;
    const name = new Date().getTime().toString(16);
    const dbName = document.getElementById("db_filename").value;
    let lng, lat, path;
    if(dbName === ""){
        alert("音声ファイルに名前をつけてください。\nGive a name to the audio file.");
        button.disabled = false;
        document.getElementById("download").disabled = false;
        document.getElementById("refresh").disabled = false;
        return;
    }
    //検索結果 or GPSのデータを使用する場合
    if((typeof geoLocate._lastKnownPosition === "undefined") && (typeof geocoder_lng === "undefined")){
        console.log("no value of lng & lat");
        alert("現在地をオンにするか、対象とする地点を検索してください。\nTurn on the current location or search for the target location.");
        button.disabled = false;
        document.getElementById("download").disabled = false;
        document.getElementById("refresh").disabled = false;
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

    var files = document.getElementById("audioform");
    if(!files){
        button.disabled = true;
        document.getElementById("download").disabled = false;
        document.getElementById("refresh").disabled = false;
        alert("データが取得できませんでした。Refreshを押してもう一度録音をしてください。\nCould not retrieve data.Press Refresh to record again.");
        return;
    }
    const file = new File([files.files[0]], name.valueOf(),{ type:"audio/wav" })
    let fileName = file.name;
    let fileType = file.type;

    //aws s3 wavfile upload
    axios.post("/sign_s3",{
        fileName : fileName,
        fileType : fileType
    }, {
        onUploadProgress: function (progressEvent) {
            var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            document.getElementById("progress").style = "width: " +  percentCompleted + "%;";
            document.getElementById("progress").innerHTML = percentCompleted + "%";
            document.getElementById("download").disabled = true;
            document.getElementById("refresh").disabled = true;
            document.getElementById("close").disabled = true;
        }
    })
    .then(response => {
        var returnData = response.data.data.returnData;
        var signedRequest = returnData.signedRequest;
        var url = returnData.url;
        var options = {
            headers: {
                'Content-Type': fileType
            }
        };
        axios.put(signedRequest,file,options)
        .then(result => {
            __log("audio uploaded");
            document.getElementById("download").disabled = false;
            document.getElementById("refresh").disabled = false;
            document.getElementById("close").disabled = false;
        })
        .catch(error => {
            __log("ERROR " + JSON.stringify(error));
        });
    })
    .catch(error => {
        __log(JSON.stringify(error));
    });

    //database upload
    const dbData = new URLSearchParams();
    dbData.append("name", dbName);
    dbData.append("location", "(" + lng + "," + lat + ")");
    path = "https://voicenoise.s3.amazonaws.com/" + fileName;
    dbData.append("path", path);
    dbData.append("num", 0);
    const dbHead = {
        method: 'post',
        data: dbData,
        'Content-Type': 'multipart/form-data'
    };
    axios.post("/sound", dbData, {
        header: dbHead
    })
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
        alert("データベースのアクセスに失敗しました。\nFailed to access the database.");
    });
}

//detail
function updateNoise(rnnoise){
	try{
        (function a() {
            requestAnimationFrame(() => {
                rnnoise.update(true);
				a();
            });
        })();

        document.getElementById("voice-noise").addEventListener("input", async () => {
            var noise = Math.round(document.getElementById("voice-noise").value * 10) / 10;
            var voice = Math.round((1 - noise) * 10) / 10;
			rnnoise.change(voice, noise);
            __log("Voice: "+ voice +" - Noise: " + noise);
            if(voice === 1.0){
                gtag('event', 'voice_click', {
                    'event_label': 'voice_on',
                    'event_category': 'voice_on',
                    'non_interaction': true
                });
            }else if(noise === 1.0){
                gtag('event', 'noise_click', {
                    'event_label': 'noise_on',
                    'event_category': 'noise_on',
                    'non_interaction': true
                });
            }  
		});
    } catch (e) {
        context.close();
        console.error(e);
        alert("RNNoiseの処理がアップデートできませんでした。\nThe RNNoise process could not be updated.");
	}
}

function dbUpload(dbName, lng, lat, path) {
    const dbData = new URLSearchParams();
    dbData.append("name", dbName);
    dbData.append("location", "(" + lng + "," + lat + ")");
    dbData.append("path", path);
    dbData.append("num", 0);
    const dbHead = {
        method: 'post',
        data: dbData,
        'Content-Type': 'multipart/form-data'
    };
    axios.post("/sound", dbData, {
        header: dbHead
    })
    .then(function (response) {
        console.log(response);
        document.getElementById("close").disabled = false;
    })
    .catch(function (error) {
        console.log(error);
        alert("データベースのアクセスに失敗しました。\nFailed to access the database.");
    });
}
    