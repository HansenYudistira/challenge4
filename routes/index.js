// const mongoDB = require('./db/mongo');
const express = require('express');
const router = express();
const { MainController } = require('../controllers/MainController')
const { AuthorizationCheck } = require('../lib/AuthorizationCheck')
const { SuperAdminCheck } = require('../lib/SuperAdminCheck')
const { AlreadyLoginCheck } = require('../lib/AlreadyLoginCheck')

//route untuk ke homepage
router.get(['/', '/home'], MainController.showHomePage);

//route untuk ke game room
router.get('/game-room', AuthorizationCheck, MainController.showGameRoomPage);

//route untuk menuju page membuat room game baru
router.get('/room/create', AuthorizationCheck, MainController.createGameRoomPage);

//route untuk membuat room game baru
router.post('/room/create', AuthorizationCheck, MainController.createGameRoom);

//route untuk join ke room
router.get('/join/:id', AuthorizationCheck, MainController.joinRoom);

//route untuk ke game
router.get('/game', AuthorizationCheck, MainController.showGamePage);

// route untuk login
// baru bisa login dengan username: admin dan password: admin
router.get('/login', AlreadyLoginCheck, MainController.showLoginPage);

//route untuk register
router.get('/register', AlreadyLoginCheck, MainController.getRegisterPage);

//route untuk konfirmasi register
router.post('/register', AlreadyLoginCheck, MainController.postRegisterPage);

// route untuk konfirmasi login username & password
router.post('/login', AlreadyLoginCheck, MainController.postLoginPage);

//route untuk logout
router.post('/logout', AuthorizationCheck, MainController.logout)

//route untuk melihat profile user
router.get('/profile', AuthorizationCheck, MainController.userProfile)

//route untuk update profile user
router.get('/updateProfile', AuthorizationCheck, MainController.updateProfilePage)

//route untuk post update profile user
router.post('/updateProfile', AuthorizationCheck, MainController.updateProfile)

//route untuk post submit pilihan game
router.post('/submit', AuthorizationCheck, MainController.submitRPS)

// ke halaman update database, bisa login dengan admin atau langsung ke /admin
router.get('/admin', SuperAdminCheck, MainController.adminMenu);

// routing ke halaman add user
router.get('/user/add', SuperAdminCheck, MainController.showUserAddMenu);

//routing untuk masukkan data baru ke database
router.post('/user-biodata/insert',SuperAdminCheck, MainController.userBiodataInsert);

// routing untuk melihat data detail dari username yang dipilih
router.get('/user/detail', SuperAdminCheck, MainController.userDetail);

// routing untuk mengisi form untuk mengupdate data user
router.get('/user/update', SuperAdminCheck, MainController.userUpdateMenu);

//routing untuk post melakukan update data user
router.post('/user-biodata/update',SuperAdminCheck, MainController.updateDataUser);

//routing untuk menghapus data yang dipilih
router.post('/user/delete', SuperAdminCheck, MainController.deleteDataUser);

//export module routing
module.exports = router;