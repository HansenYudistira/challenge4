const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'postgres',
    database: process.env.PG_DATABASE_NAME,
    host: process.env.PG_DATABASE_HOST,
    port: process.env.PG_DATABASE_PORT,
    username: process.env.PG_DATABASE_USER,
    password: process.env.PG_DATABASE_PASSWORD
});

const usernameModel = sequelize.define('user_data', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'user_data',
    underscored: true,
    createdAt: true,
    updatedAt: false
});

const userbiodataModel = sequelize.define('user_biodata', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING
    },
    city: {
        type: DataTypes.STRING
    },
    country: {
        type: DataTypes.STRING
    },
    username: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'user_biodata',
    underscored: true,
    createdAt: false,
    updatedAt: false
});

module.exports = { usernameModel, userbiodataModel, sequelize };