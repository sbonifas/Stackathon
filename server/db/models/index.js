const User = require('./user')
const Towns = require('./towns')
const ZCTAs = require('./zctas')
const { databaseName } = require( '../db')

module.exports = {
  User,
  Towns,
  ZCTAs,
  databaseName
}
