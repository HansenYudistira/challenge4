const { sequelize } = require('../config');
const { col, DataTypes } = require('sequelize');
const { userBiodataModel } = require('./UserBiodataModel')
const { userHistoryModel } = require('./UserHistoryModel')

class usernameModel {
    constructor() {
        this.model = sequelize.define('user', {
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
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            tableName: 'user',
            updatedAt: false
        });
    }

    async insertData(username, password) {
        const insertedData = await this.model.create({ username, password });
        return insertedData;
    }

    async getData(username) {
        const data = await this.model.findOne({
            where: {
                username
            },
            attributes: ['username', 'password', 'id'],
            raw: true
        });
        return data;
    }

    async getDetail(username) {
        var userData = await this.model.findOne({
            where: { username },
            attributes: [
                'username',
                'password',
                [col('"biodataUser"."name"'), 'name'],
                [col('"biodataUser"."city"'), 'city'],
                [col('"biodataUser"."country"'), 'country'],
                [col('"historyUser"."win"'), 'win'],
                [col('"historyUser"."lose"'), 'lose']
            ],
            include: [
                {
                    model: userBiodataModel.model,
                    attributes: []
                },
                {
                    model: userHistoryModel.model,
                    attributes: []
                }
            ]
        });
        return userData;
    }

    async updateData(username, hashedpassword) {
        const updatedData = await this.model.update({ username, hashedpassword }, { where: { username } });
        return updatedData;
    }

    async deleteData(username) {
        const deletedData = await this.model.destroy({ where: { username } });
        return deletedData;
    }
}
const userModel = new usernameModel;

module.exports = { userModel };