//==LIBRARY YANG DIBUTUHKAN
const express = require('express');
const routes = require('./routes');
const { error } = require('console');
var cookieParser = require('cookie-parser');
const path = require('path');


const port = 3000;
// == BUAT SERVERNYA
const app = express();
app.set('view engine', 'ejs');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const rooms = {};

// MIDDLEWARE
const logger = function (req, res, next) {
    console.log('Hit API:', req.method, req.url);
    next();
};
app.use(logger);
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.static('images'));
app.use(cookieParser());

app.use(function (req, res, next) {
    const date = new Date();
    console.log(req.url);
    console.log('Time', date.toLocaleString());
    next();
})

//== ROUTING
app.use('/', routes);

// == ERROR HANDLING
app.use(function (req, res, next) {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use(function (error, req, res, next) {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('createGame', () => {
        const roomUniqueId = makeid(6);
        rooms[roomUniqueId] = {};
        socket.join(roomUniqueId);
        socket.emit("newGame", {roomUniqueId: roomUniqueId})
    });

    socket.on('joinGame', (data) => {
        if(rooms[data.roomUniqueId] != null) {
            socket.join(data.roomUniqueId);
            socket.to(data.roomUniqueId).emit("playersConnected", {});
            socket.emit("playersConnected");
        }
    })

    socket.on("p1Choice",(data)=>{
        let rpsValue = data.rpsValue;
        rooms[data.roomUniqueId].p1Choice = rpsValue;
        socket.to(data.roomUniqueId).emit("p1Choice",{rpsValue : data.rpsValue});
        if(rooms[data.roomUniqueId].p2Choice != null) {
            declareWinner(data.roomUniqueId);
        }
    });

    socket.on("p2Choice",(data)=>{
        let rpsValue = data.rpsValue;
        rooms[data.roomUniqueId].p2Choice = rpsValue;
        socket.to(data.roomUniqueId).emit("p2Choice",{rpsValue : data.rpsValue});
        if(rooms[data.roomUniqueId].p1Choice != null) {
            declareWinner(data.roomUniqueId);
        }
    }); 
});

function declareWinner(roomUniqueId) {
    let p1Choice = rooms[roomUniqueId].p1Choice;
    let p2Choice = rooms[roomUniqueId].p2Choice;
    let winner = null;
    if (p1Choice === p2Choice) {
        winner = "d";
    } else if (p1Choice == "Paper") {
        if (p2Choice == "Scissor") {
            winner = "p2";
        } else {
            winner = "p1";
        }
    } else if (p1Choice == "Rock") {
        if (p2Choice == "Paper") {
            winner = "p2";
        } else {
            winner = "p1";
        }
    } else if (p1Choice == "Scissor") {
        if (p2Choice == "Rock") {
            winner = "p2";
        } else {
            winner = "p1";
        }
    }
    io.sockets.to(roomUniqueId).emit("result", {
        winner: winner
    });
    rooms[roomUniqueId].p1Choice = null;
    rooms[roomUniqueId].p2Choice = null;
}


//===========
server.listen(port, function () {
    console.log(`Server berjalan di port ${port} !`)
});

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}