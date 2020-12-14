const express = require('express');
const app = express();
const axios = require('axios');
const fileUpload = require('express-fileupload');
const dbRouter = require('./routes/db');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/sound', dbRouter);
app.use(fileUpload());

app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    let wavfile = req.files.wav;
    let wavname = wavfile.name;
    wavfile.mv(`public/audio/${wavfile.name}.wav`, function(err) {
        if (err) {
            console.log('error');
            return res.status(500).send(err);
        }
        res.send('File uploaded!');
    });
});

app.listen(process.env.PORT || 8000, () => {
    console.log('server started')
});