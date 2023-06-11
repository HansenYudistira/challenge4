const JWT = require('jsonwebtoken');

function SuperAdminCheck(req, res, next) {
    const token = req.cookies.token;
    if(token) {
        try {
            const validToken = JWT.verify(token, process.env.JWT_SECRET);
            if(validToken.username === "admin") next();
            else res.status(401).send('Not Authorized');
        } catch (error) {
            console.log(error);
            res.status(401).send('Not Authorized');
        }
    } else {
        res.status(401).send('Not Authorized');
    }   
}

module.exports = {SuperAdminCheck}