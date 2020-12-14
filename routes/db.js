const { Router } = require('express');
const router = Router();
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = 'postgres://zkwjehivxofixc:5596647465f6049b85e989b64f2050d3c03f127be32822bb9e8e3933cc9f9837@ec2-52-6-75-198.compute-1.amazonaws.com:5432/ddtfst4av9fgu1';

const pool = new Pool({
    connectionString: connectionString
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