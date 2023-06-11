const { sequelize } = require('../config');
const { DataTypes } = require('sequelize');

class userbiodataModel {
    constructor() {
        this.model = sequelize.define('biodataUser', {
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
    }
    
    async insertData(name, city, country, username) {
        const insertedData = await this.model.create({ name, city, country, userDataUsername: username });
        return insertedData;
    }

    async updateData(username, name, city, country) {
        const updatedData = await this.model.update({ name, city, country, userDataUsername: username }, { where: { userDataUsername: username } });
        return updatedData;
    }

    async deleteData(username) {
        const deletedData = await this.model.destroy({ where: { userDataUsername: username } });
        return deletedData;
    }
}

const userBiodataModel = new userbiodataModel;
module.exports = { userBiodataModel };