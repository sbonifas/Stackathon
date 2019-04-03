'use strict'
const path = require('path')
const Sequelize = require('sequelize')
const db = require('../server/db')
const fs = require( 'fs')
const { Towns, ZCTAs} = require('../server/db/models')
// const sqlQuery = require( '../GIS data/townssurvey_shp/townsSeed.sql')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const sqlQuery = fs.readFileSync( './public/data/townsSeed.sql', 'utf8');

  const queryArray = sqlQuery.split(';')
  const sequelize = new Sequelize( 'postgis_25_sample', 'postgres', null, { dialect: 'postgres'})
  queryArray.forEach( async queryLine => {
    await sequelize.query( queryLine)
  })
  await sequelize.query( "CREATE INDEX idx_towns_geom ON towns USING gist(geom);")
  await sequelize.query( "CREATE INDEX idx_towns_town ON towns USING btree(town);")

  const zctaFile = fs.readFileSync( './public/data/ZCTA.csv', 'utf8').trim()
  const zctaArray = zctaFile.split('\n')
  const zctaRecords = []
  zctaArray.forEach( zctaValues => {
    zctaValues = zctaValues.trim().split(',')
    zctaRecords.push({zcta: zctaValues[ 0], water_area_meter: zctaValues[ 1], land_area_meter: zctaValues[ 2], water_area_mile: zctaValues[ 3], land_area_mile: zctaValues[ 4], latitude: zctaValues[ 5], longitude: zctaValues[ 6]})
  })

  await ZCTAs.bulkCreate( zctaRecords)

  await sequelize.query( "UPDATE zctas SET thepoint_lonlat = ST_SetSRID(ST_Point( longitude, latitude),4269);")
  await sequelize.query( "UPDATE zctas SET thepoint_26986 = ST_Transform(ST_SetSRID(ST_Point(longitude, latitude),4269), 26986);")
  await sequelize.query( "CREATE INDEX idx_zctas_geom ON zctas USING gist(thepoint_26986);")

  await sequelize.query('CREATE MATERIALIZED VIEW mass_zctas AS SELECT thepoint_26986, town, water_area_mile, land_area_mile, latitude, longitude FROM (SELECT thepoint_26986, town, water_area_mile, land_area_mile, latitude, longitude FROM zctas INNER JOIN towns on ST_Contains( geom, thepoint_26986)) as zcta_town;')
  await sequelize.query( "CREATE INDEX idx_zcta_town ON mass_zctas USING btree(town);")

  await sequelize.query( "COMMIT;")
}

async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

if (module === require.main) {
  runSeed()
}

module.exports = seed
