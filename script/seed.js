'use strict'
const Sequelize = require('sequelize')
const db = require('../server/db')
const fs = require( 'fs')
const {User, Towns} = require('../server/db/models')
// const sqlQuery = require( '../GIS data/townssurvey_shp/townsSeed.sql')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const sqlQuery = fs.readFileSync( 'C:/Users/townsSeed.sql', 'utf8');

  const queryArray = sqlQuery.split(';')
  const sequelize = new Sequelize( 'testPostGIS', 'postgres', null, { dialect: 'postgres'})
  const users = await Promise.all([
    User.create({email: 'cody@email.com', password: '123'}),
    User.create({email: 'murphy@email.com', password: '123'})
  ])
  queryArray.forEach( async queryLine => {
    await sequelize.query( queryLine)
  })
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
