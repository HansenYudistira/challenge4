const { sequelize } = require('../config');
const { DataTypes } = require('sequelize');

class userhistoryModel {
    constructor() {
        this.model = sequelize.define('historyUser', {
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
    }
    
    async insertData(username) {
        const insertedData = await this.model.create({ win: 0, lose: 0, userDataUsername: username });
        return insertedData;
    }

    async updateData(username, win, lose) {
        const updatedData = await this.model.update({ win, lose, userDataUsername: username }, { where: { userDataUsername: username } });
        return updatedData;
    }

    async deleteData(username) {
        const deletedData = await this.model.destroy({ where: { userDataUsername: username } });
        return deletedData;
    }
}

const userHistoryModel = new userhistoryModel;
module.exports = { userHistoryModel };