const { Router } = require('express');
const router = Router();
const { Pool } = require('pg');
require('dotenv').config();

// const pool = new Pool({
//     host: process.env.PG_HOST,
//     username: process.env.PG_USER,
//     database: process.env.PG_DATABASE,
//     port: process.env.PG_PORT,
//     password: process.env.PG_PASSWORD
// });

const pool = new Pool({
    host: process.env.ENV_HOST,
    username: process.env.ENV_USER,
    database: process.env.ENV_DATABASE,
    port: process.env.ENV_PORT,
    password: process.env.ENV_PASSWORD
});

// ("name", "(lan, lat)", "audio/" + "filename.wav", num)
router.get('/', async (req, res) => {
    const responce_from_db = await pool.query('SELECT * FROM voice_noise_table');
    console.log(responce_from_db.rows);
    res.send(responce_from_db.rows);
});

router.post('/', async (req, res) => {
    const m = [req.body.name, req.body.location, req.body.path, req.body.num];
    const reponce_from_db = await pool.query('INSERT INTO voice_noise_table VALUES($1, $2, $3, $4)', m);
    res.send("post!");
});

module.exports = router;