const { sequelize } = require('../config');
const { col, DataTypes } = require('sequelize');
const { userHistoryModel } = require('./UserHistoryModel')

class gameRoomModel {
    constructor() {
        this.model = sequelize.define('gameRoom', {
            id: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false
            },
            roomName: {
                type: DataTypes.STRING
            },
            player1name: {
                type: DataTypes.STRING
            },
            player2name: {
                type: DataTypes.STRING
            },
            player1choose: {
                type: DataTypes.STRING
            },
            player2choose: {
                type: DataTypes.STRING
            },
            round: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            winner: {
                type: DataTypes.STRING
            }
        }, {
            tableName: 'gameRoom',
            updatedAt: false,
            createdAt: false
        });
    }

    async createNewRoom(roomName) {
        const insertedData = await this.model.create({ roomName, round: 1 });
        return insertedData;
    }

    async updatePlayer1(id, username) {
        const updatedData = await this.model.update({ player1name: username }, { where: { id } });
        return updatedData;
    }

    async updatePlayer2(id, username) {
        const updatedData = await this.model.update({ player2name: username }, { where: { id } });
        return updatedData;
    }

    async getDetail(id) {
        var gameRoomData = await this.model.findOne({
            where: { id },
            attributes: [
                'id',
                'roomName',
                'player1name',
                'player2name',
                'player1choose',
                'player2choose',
                'round',
                'winner'
            ]
        });
        return gameRoomData;
    }
}

const gameroomModel = new gameRoomModel;
module.exports = { gameroomModel };