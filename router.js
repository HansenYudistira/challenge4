const express = require('express');
const router = express();
const mongoDB = require('./db/mongo');
const postgresqlDb = require('./db/postgresql')

//route untuk ke homepage
router.get(['/', '/home'], function (req, res) {
    res.render(__dirname + '/homepage');
    const username = req.session.username;
    if (username) {
        res.send(`${username}! <a href="/logout">Logout</a>`);
    } else {
        res.send('<a href="/login">Login</a>');
    }
})

//route untuk ke game
router.get('/game', function (req, res) {
    res.render(__dirname + '/games');
})

// route untuk login
// baru bisa login dengan username: admin dan password: admin
router.get('/login', function (req, res) {
    res.render(__dirname + '/login');
})

// route untuk konfirmasi login username & password
router.post('/login-confirmation', async function (req, res) {
    try {
        //ambil data dari body
        const data = req.body;
        // ambil data dari database
        // const userData = await mongoDB.db.findOne({ username: data.username});
        const queryData = await postgresqlDb.client.query('SELECT * FROM public.user_data WHERE username = $1', [data.username]);
        const userData = queryData.rows[0];
        console.log(userData);
        // perbandingan username & password
        // jika user data tidak ditemukan kembali ke menu login
        if (userData === null) {
            var errorMessage = 'Username atau password salah';
            res.render(__dirname + '/login', { errorMessage: errorMessage });
        } else {
            // jika data yang dimasukkan benar
            if (data.password === userData.password) {
                var username = userData.username;
                res.render(__dirname + '/homepage', { username: username });
            }
            // jika password salah
            else {
                var errorMessage = 'Username atau password salah';
                res.render(__dirname + '/login', { errorMessage: errorMessage });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'Internal Server Error!' });
    }
});

//export module routing
module.exports = router;