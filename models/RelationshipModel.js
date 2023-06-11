const { userBiodataModel } = require('./UserBiodataModel')
const { userHistoryModel } = require('./UserHistoryModel')
const { userModel } = require('./UsernameModel')

userModel.model.hasOne(userBiodataModel.model, {
    foreignKey: 'userDataUsername',
    sourceKey: 'username'
})

userModel.model.hasOne(userHistoryModel.model, {
    foreignKey: 'userDataUsername',
    sourceKey: 'username'
})

module.exports = { userModel, userBiodataModel, userHistoryModel };