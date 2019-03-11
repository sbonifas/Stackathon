const Sequelize = require('sequelize')
const { db} = require('../db')

const Towns = db.define('towns', {
  gid: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  town: Sequelize.STRING,
  town_id: Sequelize.INTEGER,
  pop1980: Sequelize.INTEGER,
  pop1990: Sequelize.INTEGER,
  pop2000: Sequelize.INTEGER,
  popch80_90: Sequelize.INTEGER,
  popch90_00: Sequelize.INTEGER,
  type: Sequelize.STRING,
  island: Sequelize.INTEGER,
  coastal_po: Sequelize.STRING,
  fourcolor: Sequelize.INTEGER,
  fips_stco: Sequelize.INTEGER,
  ccd_mcd: Sequelize.STRING,
  fips_place: Sequelize.STRING,
  fips_mcd: Sequelize.STRING,
  fips_count: Sequelize.STRING,
  acres: Sequelize.FLOAT,
  square_mil: Sequelize.FLOAT,
  pop2010: Sequelize.INTEGER,
  popch00_10: Sequelize.INTEGER,
  shape_area: Sequelize.FLOAT,
  shape_len: Sequelize.FLOAT,
  geom: Sequelize.GEOMETRY( 'POLYGON', 26986),
  // createdAt: {
  //   allowNull: false,
  //   defaultValue: new Date(),
  //   type: Sequelize.DATE
  // },
  // updatedAt: {
  //   allowNull: false,
  //   defaultValue: new Date(),
  //   type: Sequelize.DATE
  // }
})

module.exports = Towns

