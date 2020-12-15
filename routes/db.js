const { Router } = require('express');
const router = Router();
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
// const connectionString = "postgres://amako:null@localhost:5432/voice_noise";

const pool = new Pool({
    // connectionString: connectionString
    host: process.env.ENV_HOST,
    database: process.env.ENV_DB,
    user: process.env.ENV_USER,
    port: 5432,
    password: process.env.ENV_PASSWORD
});

pool.connect();

// ("name", "(lan, lat)", "audio/" + "filename.wav", num)
router.get('/', async (req, res) => {
    const responce_from_db = await pool.query('SELECT * FROM voice_noise_table')
    console.log(responce_from_db.rows);
    res.send(responce_from_db.rows);
});

router.post('/', async (req, res) => {
    const m = [req.body.name, req.body.location, req.body.path, req.body.num];
    const reponce_from_db = await pool.query('INSERT INTO voice_noise_table (name, location, path, num) VALUES($1, $2, $3, $4)', m);
    res.send("post!");
});

module.exports = router;