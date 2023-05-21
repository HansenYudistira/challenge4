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

const userbiodataModel = sequelize.define('biodataUser', {
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
    userDataUsername: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'biodataUser',
    underscored: false,
    createdAt: false,
    updatedAt: false
});

const userHistoryModel = sequelize.define('historyUser', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    win: {
        type: DataTypes.INTEGER
    },
    lose: {
        type: DataTypes.INTEGER
    },
    userDataUsername: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'historyUser',
    underscored: false,
    createdAt: false,
    updatedAt: true
});

usernameModel.hasOne(userbiodataModel, {
    foreignKey: 'userDataUsername',
    sourceKey: 'username'
})

usernameModel.hasOne(userHistoryModel, {
    foreignKey: 'userDataUsername',
    sourceKey: 'username'
})

module.exports = { usernameModel, userbiodataModel, userHistoryModel, sequelize };