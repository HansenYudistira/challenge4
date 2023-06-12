const CryptoJs = require('crypto-js');
const JWT = require('jsonwebtoken');
const { userModel, userBiodataModel, userHistoryModel, gameroomModel } = require('../models/RelationshipModel');
const { sequelize } = require('../config');

class MainController {
    //controller untuk menuju homepage
    static showHomePage(req, res) {
        try {
            if(req.cookies.token){
                const decodedToken = JWT.decode(req.cookies.token);
                res.render('HomePage', {username: decodedToken.username})
            } else res.render('HomePage', {username: null});
        } catch (error) {
            console.log(error);
            res.render('error', {error, message: 'Database Error'})
        }
    }

    //controller untuk menuju game room page
    static async showGameRoomPage(req, res) {
        try {
            // ambil data room di db
            let gameRoomData = await gameroomModel.model.findAll();
            gameRoomData = gameRoomData.map(function (data) {
                return data.toJSON();
            })
            console.log(gameRoomData)
            // tampilkan halaman
            res.render('game_room', { gameRoomData });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }

    //controller untuk menuju game page
    static async showGamePage(req, res) {
        try {
            // ambil data room di db
            let gameRoomData = await gameroomModel.model.findAll();
            gameRoomData = gameRoomData.map(function (data) {
                return data.toJSON();
            })
            console.log(gameRoomData)
            // tampilkan halaman
            res.render('game_room', { gameRoomData });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }

    // controller untuk update Win or Lose
    static async updateWin(req, res) {
        try {
            const decodedToken = JWT.decode(req.cookies.token);
            // update win + 1 ke database
            await userBiodataModel.updateWin(decodedToken.username)
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
    static async updateLose(req, res) {
        try {
            const decodedToken = JWT.decode(req.cookies.token);
            // update win + 1 ke database
            await userBiodataModel.updateLose(decodedToken.username)
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }

    //controller untuk menuju page membuat room game baru
    static async createGameRoomPage(req,res) {
        res.render('create_room');
    }

    //controller untuk membuat room game baru
    static async createGameRoom(req, res) {
        const transaction = await sequelize.transaction();
        try {
            // ambil bodynya
            const { roomName } = req.body;
            // insert username & password to database
            const insertedData = await gameroomModel.createNewRoom(roomName, { transaction });
            await transaction.commit();
            res.redirect('/game-room');
        } catch (error) {
            await transaction.rollback();
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }

    static async joinRoom(req, res) {
        try {
            const { id } = req.params;
            const decodedToken = JWT.decode(req.cookies.token);
            // ambil data dari database
            let gameRoomData = await gameroomModel.getDetail(id);
            //kalau masih kosong join sebagai player 1
            if(gameRoomData.player1name === null) {
                await gameroomModel.updatePlayer1(id, decodedToken.username);
                const token = JWT.sign({ username: decodedToken.username, id: decodedToken.id}, process.env.ROOM_SECRET, { expiresIn: '1h' });
                res.cookie('tokenRoom', token, { maxAge: 1000 * 60 * 60 });
                return res.render('games', {gameRoomData, user: decodedToken});
            } else if(gameRoomData.player2name === null) {
                await gameroomModel.updatePlayer2(id, decodedToken.username);
                const token = JWT.sign({ username: decodedToken.username, id: decodedToken.id}, process.env.ROOM_SECRET, { expiresIn: '1h' });
                res.cookie('tokenRoom', token, { maxAge: 1000 * 60 * 60 });
                return res.render('games', {gameRoomData, user: decodedToken});
            } else {
                var errorMessage = 'Room Penuh !';
                return res.redirect('/game-room');
            }
            //update ke db dengan sequelize
            res.render('profile', { gameRoomData: gameRoomData.toJSON() });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }

    //controller untuk mengkonfirmasi data login yang dimasukkan
    static async postLoginPage(req, res) {
        try {
            //ambil data dari body
            const { username, password } = req.body;
            // ambil data dari database
            // const userData = await mongoDB.db.findOne({ username: data.username});
            const userData = await userModel.getData(username);
            // perbandingan username & password
            // jika user data tidak ditemukan kembali ke menu login
            if (userData === null) {
                var errorMessage = 'Username tidak ditemukan !';
                return res.render('login', { errorMessage: errorMessage });
            }
            const hashedPassword = CryptoJs.HmacSHA256(password, process.env.SECRET_LOGIN).toString();
            // jika data yang dimasukkan benar
            if (hashedPassword === userData.password) {
                const token = JWT.sign({ username, id: userData.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.cookie('token', token, { maxAge: 1000 * 60 * 60 });
                // jika ingin masuk ke dashboard editing database pakai username admin
                if (username === 'admin') res.redirect('/admin');
                else res.render('HomePage', {username} );
            }
            // jika password salah
            else {
                var errorMessage = 'Password yang dimasukkan salah!';
                res.render('login', { errorMessage: errorMessage });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 'Internal Server Error!' });
        }
    }

    static async submitRPS(req, res) {
        const RPS = req.body.RPS;

    }

    static logout(req, res) {
        res.clearCookie('token');
        res.clearCookie('tokenRoom');
        res.redirect('login');
    }

    //controller untuk menuju menu admin
    static async adminMenu(req, res) {
        try {
            // ambil data customer di db
            let userData = await userModel.model.findAll();
            userData = userData.map(function (data) {
                return data.toJSON();
            })
            // tampilkan halaman
            res.render('admin-menu', { userData });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error!');
        }
    }

    // controller ke halaman add user
    static showUserAddMenu(req, res) {
        res.render('user_upsert', { isUpdate: false });
    }

    //controller untuk masukkan data baru ke database
    static async userBiodataInsert(req, res) {
        const transaction = await sequelize.transaction();
        try {
            // ambil bodynya
            const { username, password, name, city, country } = req.body;
            // Hash Password
            const hashedPassword = CryptoJs.HmacSHA256(password, process.env.SECRET_LOGIN).toString();
            // insert username & password to database
            const insertedData = await userModel.insertData(username, hashedPassword, { transaction });
            // insert ke table biodata
            await userBiodataModel.insertData(name, city, country, insertedData.toJSON().username, { transaction });
            await userHistoryModel.insertData(insertedData.toJSON().username, { transaction });
            await transaction.commit();
            res.redirect('/admin');
        } catch (error) {
            await transaction.rollback();
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }

    //controller untuk menuju login page
    static showLoginPage(req, res) {
        res.render('login');
    }

    //controller untuk menuju register page
    static getRegisterPage(req, res) {
        res.render('register');
    }

    //controller untuk post register Page
    static async postRegisterPage(req, res) {
        const transaction = await sequelize.transaction();
        try {
            const { username, password, confirm_password, name, city, country } = req.body;
            // Validasi input usernya
            if (password !== confirm_password) {
                return res.render('register', { errorMessage: "Password tidak sama !"})
            }
            // Hash Password
            const hashedPassword = CryptoJs.HmacSHA256(password, process.env.SECRET_LOGIN).toString();
            // insert username & password to database
            await userModel.insertData(username, hashedPassword, { transaction });
            await userBiodataModel.insertData(name, city, country, username, { transaction });
            await userHistoryModel.insertData(username, { transaction });
            await transaction.commit();
            res.redirect('login')
        } catch (error) {
            await transaction.rollback();
            console.log(error);
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.render('register', { errorMessage: 'Username Already Taken !' })
            }
            res.render('error', { error, message: 'Database Error' })
        }
    }

    //controller untuk melihat profile
    static async userProfile(req, res) {
        try {
            const decodedToken = JWT.decode(req.cookies.token);
            // ambil data dari database
            const userData = await userModel.getDetail(decodedToken.username)
            // update ke db dengan sequelize
            res.render('profile', { user: userData.toJSON() });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }

    // controller untuk mengisi form untuk mengupdate data user
    static async updateProfilePage(req, res) {
        try {
            const decodedToken = JWT.decode(req.cookies.token);
            // ambil data dari database
            const userData = await userModel.getDetail(decodedToken.username)
            // update ke db dengan sequelize
            res.render('updateProfile', { user: userData.toJSON() });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }

     //controller untuk post melakukan update profile user
     static async updateProfile(req, res) {
        const transaction = await sequelize.transaction();
        try {
            const decodedToken = JWT.decode(req.cookies.token);
            //ambil data dari body
            const { name, city, country } = req.body;
            // insert ke table biodata
            await userBiodataModel.updateData( decodedToken.username, name, city, country, { transaction });
            await transaction.commit();
            res.redirect('/profile');
        } catch (error) {
            await transaction.rollback();
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }

    // controller untuk melihat data detail dari username yang dipilih
    static async userDetail(req, res) {
        try {
            const username = req.query.username;
            // ambil data dari database
            const userData = await userModel.getDetail(username);
            // update ke db dengan sequelize
            res.render('detail', { user: userData.toJSON() });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }

    // controller untuk mengisi form untuk mengupdate data user
    static async userUpdateMenu(req, res) {
        try {
            const username = req.query.username;
            console.log(username);
            // ambil data dari database
            const userData = await userModel.getDetail(username);
            // update ke db dengan sequelize
            res.render('user_upsert', { user: userData.toJSON(), isUpdate: true });
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }

    //controller untuk post melakukan update data user
    static async updateDataUser(req, res) {
        const transaction = await sequelize.transaction();
        try {
            // ambil data query
            const username = req.query.username;
            //ambil data dari body
            const { password, name, city, country, win, lose } = req.body;
            // Hash Password
            const hashedPassword = CryptoJs.HmacSHA256(password, process.env.SECRET_LOGIN).toString();
            // insert ke table user
            await userModel.updateData(username, hashedPassword, {transaction});
            // insert ke table biodata
            await userBiodataModel.updateData( username, name, city, country, { transaction });
            await userHistoryModel.updateData(username, win, lose, { transaction });
            await transaction.commit();
            res.redirect('/admin');
        } catch (error) {
            await transaction.rollback();
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }

    //controller untuk menghapus data yang dipilih
    static async deleteDataUser(req, res) {
        const transaction = await sequelize.transaction();
        try {
            // ambil data query
            const username = req.query.username;
            // delete ke table biodata & history
            await userBiodataModel.deleteData(username, { transaction });
            await userHistoryModel.deleteData(username, { transaction });
            // delete ke table user
            await userModel.deleteData(username, { transaction });
            await transaction.commit();
            res.redirect('/admin');
        } catch (error) {
            await transaction.rollback();
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = { MainController }