const express = require('express');
const router = express();
const mongoDB = require('./db/mongo');
const postgresqlDb = require('./db/postgresql')
const { usernameModel, userbiodataModel, sequelize } = require('./db/sequelize')

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
        const queryData = await postgresqlDb.client.query(`SELECT * FROM public.user_data WHERE username = $1`, [data.username]);
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

// get user list menggunakan query biasa
// router.get('/user1/list', async function(req,res) {
//     try{
//         let additionalQuery = '';
//         let additionalQueryParams = [];
//         // filter
//         if(req.query.username) {
//             additionalQuery = `${additionalQuery} username = $${additionalQueryParams.length + 1}`;
//             additionalQueryParams.push(req.query.username);
//         }
//         if(req.query.password) {
//             if(additionalQueryParams.length > 0) additionalQuery = additionalQuery + ' AND ';
//             additionalQuery = `${additionalQuery} password = $${additionalQueryParams.length + 1}`;
//             additionalQueryParams.push(req.query.password);
//         }
//         if(additionalQueryParams.length > 0) {
//             additionalQuery = 'where' + additionalQuery;
//         }
//         // ambil data dari database
//         const queryData = await postgresqlDb.client.query(
//             `
//             SELECT *
//             FROM public.user_data
//             ${additionalQuery}
//             `, additionalQueryParams
//         )
//         const customerData = queryData.rows;
//         res.json({data: customerData});
//     }
//     catch (error) {
//         console.log(error);
//     }
// });

//get user list dengan sequelize
router.get('/user/list', async function(req,res) {
    try{
        let condition = {}
        //filter
        if(req.query.username) condition = { ...condition, username:req.query.username};
        if(req.query.password) condition = { ...condition, password:req.query.password};
        // ambil data dari database
        const queryData = await usernameModel.findAll({ where: condition});
        const userData = queryData;
        res.json({data: userData});
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/user/insert', async function (req,res) {
    try{
        // ambil data dari body
        const username = req.body.username;
        const password = req.body.password;

        // insert ke db dengan sequelize
        await usernameModel.create({ username, password });
        res.status(200).json({ message: 'username created' });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
})

router.put('/user/update/:username', async function (req, res) {
    try{
        // ambil data dari body
        const username = req.body.username;
        const password = req.body.password;
        // update ke db dengan sequelize
        await usernameModel.update({ username, password}, { where: {username: req.params.username} });
        res.status(200).json({ message: 'userdata updated' });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
})

router.delete('/user/delete/:username', async function (req, res) {
    try{
        // update ke db dengan sequelize
        await usernameModel.destroy({ where: {username: req.params.username} });
        res.status(200).json({ message: 'userdata deleted' });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
})

router.post('/user-biodata/insert', async function (req, res) {
    const transaction = await sequelize.transaction();
    try{
        // ambil bodynya
        const {username, password, name, city, country} = req.body;
        // insert ke table user
        const insertedData = await usernameModel.create({ username, password}, { transaction });
        // insert ke table biodata
        await userbiodataModel.create({ name, city, country, username: insertedData.toJSON().username }, { transaction });
        await transaction.commit();
        res.status(200).json({ message: 'user biodata updated' });
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
})

//export module routing
module.exports = router;