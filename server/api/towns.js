const router = require('express').Router()
const { Towns, ZCTAs} = require('../db/models')
// const Sequelize = require('sequelize')
// const sequelize = new Sequelize( databaseName, 'postgres', null, { dialect: 'postgres'})

module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const towns = await Towns.findAll({ order: [['town', 'ASC'], [ 'square_mil', 'DESC']]
    })
    res.json( towns)
  } catch (err) {
    next(err)
  }
})

router.get('/name/:gid', async (req, res, next) => {
  try {
    const town = await Towns.findById( req.params.gid)
    const towns = await Towns.findAll({
      where: { town: town.town}
    })
    const zctas = await ZCTAs.sequelize.query(
      'SELECT * FROM mass_zctas WHERE  town=:townName',
      { replacements: {
      townName: town.town
    }})
    res.json( {towns, zctas: zctas[0]})
  } catch (err) {
    next(err)
  }
})

router.get('/:gid', async (req, res, next) => {
  try {
    let town = await Towns.findById( req.params.gid)
    const zctas = await ZCTAs.sequelize.query(
      'SELECT * FROM zctas WHERE ST_Contains( ( SELECT geom FROM towns WHERE gid=:townID), thepoint_26986)',
      { replacements: {
      townID: town.gid
    }})
    town = [ town]
    res.json({ town, zctas: zctas[0]})
  } catch (err) {
    next(err)
  }
})
