const Sequelize = require('sequelize')
const { db} = require('../db')

const ZCTAs = db.define('zctas', {
  zcta: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  water_area_meter: Sequelize.FLOAT,
  land_area_meter: Sequelize.FLOAT,
  water_area_mile: Sequelize.FLOAT,
  land_area_mile: Sequelize.FLOAT,
  latitude: Sequelize.FLOAT,
  longitude: Sequelize.FLOAT,
  thepoint_lonlat: Sequelize.GEOMETRY( 'POINT'),
  thepoint_meter: Sequelize.GEOMETRY( 'POINT'),
  thepoint_26986: Sequelize.GEOMETRY( 'POINT', 26986)
})

module.exports = ZCTAs
