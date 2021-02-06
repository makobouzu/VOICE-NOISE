function __log(e, data) {
    console.log(e + " " + (data || ''));
}

var bufferLoader;
var buffer = [];
var sources = [];
var audio_context;
var rnnoise;
var gainNode;
document.getElementById("complete").style = "display: none;";
var now = new Date();
localStorage.setItem('time1', 'First');

window.onload = function init(){
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

    axios.get('/sound')
    .then(response => {
        const sounds = response.data;
        sounds.map(s => {
            buffer.push(`${s.path}`);
        });
        bufferLoader = new BufferLoader(audio_context, buffer, finishedLoading);
        bufferLoader.load();
        resolve('Audio Loaded!');
    })
    .then(value => {
        console.log(value);
        document.getElementById("slider").style = "opacity: 1.0;";
        document.getElementById("voice-noise").disabled = false;
        for(const i = 0; i < init_markers.length; ++i){
            init_markers[i].remove();
        }
    })
    .catch(err => {
        console.log(err);
    });

}

async function finishedLoading(bufferList) {
    rnnoise = new RNNoiseNode(audio_context);
    gainNode = audio_context.createGain();
    for (let i = 0; i < bufferList.length; ++i) {
        var source = audio_context.createBufferSource();
        source.buffer = bufferList[i];
        source.loop = true;
        source.connect(rnnoise);
        rnnoise.connect(gainNode);
        gainNode.connect(audio_context.destination);
        sources.push(source);
    }
    updateNoise(rnnoise);
}

function updateList(bufferList, sources, num){
    var source = audio_context.createBufferSource();
    source.buffer = bufferList[num];
    source.connect(rnnoise);
    rnnoise.connect(gainNode);
    gainNode.connect(audio_context.destination);
    sources.splice(num, 1, source);
}

function uploadRec() {
    gtag('event', 'submit_click', {
        'event_label': 'data_preview_on',
        'event_category': 'data_preview_on',
        'non_interaction': true
    });
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
    const fileFormat = String(files.files[0].name).split('.')[1];
    if(fileFormat === "wav" || fileFormat === "WAV" || fileFormat === "mp3" || fileFormat === "MP3"){
        audio.controls = true;
        audio.src = file;
        audio.id = "sample";
        audioComfirm.appendChild(audio);
    }else{
        alert("音声ファイル(wav/mp3)をアップロードしてください。\nUpload the audio file (wav/mp3).");
        files.value = "";
        return;
    }
}

function refresh(button){
    gtag('event', 'refresh_click', {
        'event_label': 'refresh_on',
        'event_category': 'refresh_on',
        'non_interaction': true
    });

    document.getElementById("audioform").value = "";
    document.getElementById("audio_comfirm").removeChild(document.getElementById("sample"));

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
    document.getElementById("refresh").disabled = true;
    const name = new Date().getTime().toString(16);
    const dbName = document.getElementById("db_filename").value;
    let lng, lat, path;
    if(dbName === ""){
        alert("音声ファイルに名前をつけてください。\nGive a name to the audio file.");
        button.disabled = false;
        document.getElementById("refresh").disabled = false;
        return;
    }
    //検索結果 or GPSのデータを使用する場合
    if((typeof geoLocate._lastKnownPosition === "undefined") && (typeof geocoder_lng === "undefined")){
        console.log("no value of lng & lat");
        alert("現在地をオンにするか、対象とする地点を検索してください。\nTurn on the current location or search for the target location.");
        button.disabled = false;
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

//-------BufferLoader---------
function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
}
  
BufferLoader.prototype.loadBuffer = function(url, index) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
  
    var loader = this;
  
    request.onload = function() {
      // Asynchronously decode the audio file data in request.response
      loader.context.decodeAudioData(
        request.response,
        function(buffer) {
          if (!buffer) {
            alert('error decoding file data: ' + url);
            return;
          }
          loader.bufferList[index] = buffer;
          if (++loader.loadCount == loader.urlList.length)
            loader.onload(loader.bufferList);
        },
        function(error) {
          console.error('decodeAudioData error', error);
        }
      );
    }
  
    request.onerror = function() {
      alert('BufferLoader: XHR error');
    }
  
    request.send();
}
  
BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i)
    this.loadBuffer(this.urlList[i], i);
}
    