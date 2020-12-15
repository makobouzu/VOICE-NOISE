const express = require('express');
const app = express();
const axios = require('axios');
const fileUpload = require('express-fileupload');
const dbRouter = require('./routes/db');
require('dotenv').config();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/sound', dbRouter);
app.use(fileUpload());

var sign_s3 = require('./routes/s3');
app.use('/sign_s3', sign_s3.s3);

app.listen(process.env.PORT || 8000, () => {
    console.log('server started')
});