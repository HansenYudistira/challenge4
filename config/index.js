const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'postgres',
    database: process.env.PG_DATABASE_NAME,
    host: process.env.PG_DATABASE_HOST,
    port: process.env.PG_DATABASE_PORT,
    username: process.env.PG_DATABASE_USER,
    password: process.env.PG_DATABASE_PASSWORD
});


module.exports = { sequelize };