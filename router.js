const express = require('express');
const router = express();
const userData = require('./db/usernameData.json');

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
router.post('/login-confirmation', function (req, res) {
// cari pengguna dengan username yang sesuai
    const user = userData.find(user => user.username === req.body.username);
// jika pengguna ditemukan dan passwordnya sesuai
    if (user && user.password === req.body.password) {
        var username = user.username;
        res.render(__dirname + '/homepage', {username: username});
    } else {
// jika data yang dimasukkan salah kembali ke menu login
        var errorMessage = 'Username atau password salah';
        res.render(__dirname + '/login', { errorMessage: errorMessage });
    }
});

//export module routing
module.exports = router;