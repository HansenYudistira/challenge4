const express = require('express');
const router = express();
const userData = require('./db/usernameData.json');

//route untuk ke homepage
router.get(['/', '/home'], function(req, res) {
    res.render(__dirname + '/index');
})

//route untuk ke game
router.get('/game', function(req, res) {
    res.render(__dirname + '/games');
})

// route untuk login
router.post('/login', function(req, res) {
    const { username, password } = req.body;

    // cari pengguna dengan username yang sesuai
    const user = userData.find(user => user.username === username);
    // jika pengguna ditemukan dan passwordnya sesuai
    if (user && user.password === password) {
        res.send('Login berhasil');
    } else {
        res.send('Username atau password salah');
    }
});

//export module routing
module.exports = router;