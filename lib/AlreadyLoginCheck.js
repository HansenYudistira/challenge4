const JWT = require('jsonwebtoken');

function AlreadyLoginCheck(req, res, next) {
    try {
        if(req.cookies.token === undefined) {
            next();
        } else { //kalau sudah terlogin lempar ke homepage untuk logout
            console.log(req.cookies.token)
            const decodedToken = JWT.decode(req.cookies.token);
            res.render('HomePage', {username: decodedToken.username})
        }
    } catch(error) {
        console.log(error);
        res.send(500).send('Database Error')
    }
}

module.exports = {AlreadyLoginCheck}