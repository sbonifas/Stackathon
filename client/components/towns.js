import React from 'react'
import {connect} from 'react-redux'
import { fetchAllTowns, fetchZCTAs, fetchTownZCTAs} from '../store/towns'
import store from '../store'

/**
 * COMPONENT
 */
class Towns extends React.Component {
  constructor() {
    super()
    this.allTowns = false
    this.changeTown = this.changeTown.bind( this)
    this.allTownName = this.allTownName.bind( this)
  }

  componentDidMount() {
    this.props.fetchAllTowns()
  }

  // getTownMaxMin( town) {
  //   const coords = town.geom.coordinates[ 0][ 0]
  //   const minMax = coords.reduce(( vals, coord) => {
  //     if ( coord[ 0] < vals.minX) vals.minX = coord[ 0]
  //     if ( coord[ 1] < vals.minY) vals.minY = coord[ 1]
  //     if ( coord [0] > vals.maxX) vals.maxX = coord[ 0]
  //     if ( coord [1] > vals.maxY) vals.maxY = coord[ 1]
  //     return vals
  //   }, { minX: coords[ 0][ 0], minY: coords[ 0][ 1], maxX: coords[ 0][ 0], maxY: coords[ 0][ 1]})
  //   return { minMax, coords}
  // }
  getTownsMaxMin( towns) {
    let allCoords = []
    let coords = towns[0].geom.coordinates[ 0][ 0]
    let minMax = { minX: coords[ 0][ 0], minY: coords[ 0][ 1], maxX: coords[ 0][ 0], maxY: coords[ 0][ 1]}
    towns.forEach( town => {
      coords = town.geom.coordinates[ 0][ 0]
      allCoords.push( coords)
      minMax = coords.reduce(( vals, coord) => {
        if ( coord[ 0] < vals.minX) vals.minX = coord[ 0]
        if ( coord[ 1] < vals.minY) vals.minY = coord[ 1]
        if ( coord [0] > vals.maxX) vals.maxX = coord[ 0]
        if ( coord [1] > vals.maxY) vals.maxY = coord[ 1]
        return vals
      }, minMax)
    })
    return { minMax,allCoords}
  }

  drawCoords( { minMax, allCoords, zctas}) {
    const canvas = document.getElementById( "myCanvas");
    const ctx = canvas.getContext( "2d");
    const scale = (( 500 / ( minMax.maxX - minMax.minX)) < ( 400 / ( minMax.maxY - minMax.minY))) ? (500 / ( minMax.maxX - minMax.minX)) : (400 / ( minMax.maxY - minMax.minY))
    ctx.setTransform()
    ctx.clearRect( 0, 0, canvas.width, canvas.height);
    ctx.transform( scale, 0, 0, scale, -minMax.minX * scale, -minMax.minY * scale)
    allCoords.forEach( coords => {
      ctx.beginPath()
      ctx.moveTo( coords[ 0][ 0], minMax.maxY + minMax.minY - coords[ 0][ 1]);
      coords.slice( 1).forEach( coord => {
        ctx.lineTo( coord[ 0], minMax.maxY + minMax.minY - coord[ 1])
      })
      ctx.lineWidth = Math.ceil( 1 / scale)
      ctx.strokeStyle = '#00FF00'
      ctx.stroke()
    })
    ctx.font = `${ 10 / scale}px Arial`
    zctas.forEach( zcta => {
      ctx.fillText( 'ZCTA', zcta.thepoint_26986.coordinates[0], minMax.maxY + minMax.minY - zcta.thepoint_26986.coordinates[1])
    })
  }

  async changeTown( event) {
    if ( this.allTowns) {
      await this.props.fetchTownZCTAs( event.target.value)
    } else {
      await this.props.fetchZCTAs( event.target.value)
      // const { minMax, coords} = this.getTownMaxMin( this.props.town)
      // this.drawCoords( { minMax, coords, zctas: this.props.zctas})
    }
    const { minMax, allCoords} = this.getTownsMaxMin( this.props.town)
    this.drawCoords( { minMax, allCoords, zctas: this.props.zctas})
  }

  allTownName( event) {
    this.allTowns = event.target.checked
  }

  render() {
    return (
      <div className='row'>
      <div width='500px' className='col'>
        <form>
          <label>Towns</label>
          <select name="town" onChange={ this.changeTown}>
            {this.props.towns.map( town => {
              return <option value={ town.gid} key={ town.gid}>  { town.town} - { Number( town.square_mil).toFixed(2)} sq. mi.</option>
            })}
          </select><br/>
          <input type='checkbox' name='All Towns' onClick={ this.allTownName} />Include all polygons with the same town name.
        </form>
        <div>
          <div>
            {(this.props.town.gid) ? (<div><p><b>Town:</b> { this.props.town.town}<b>Population 2010:</b>{this.props.town.pop2010}</p>
            <h2>Zip Code Tabulation Areas</h2></div>) : ''}
          </div>
          <div>
            {this.props.zctas.map( zcta => {
              return <p key={ zcta.zcta}>
              <b>ZCTA: </b> { zcta.zcta}
              <b>Size(sq.mi.): </b> { Number( zcta.water_area_mile + zcta.land_area_mile).toFixed( 2)}
              <b>Latitude: </b> { Number( zcta.latitude).toFixed( 4)}
              <b>Longitude: </b> { Number( zcta.longitude).toFixed( 4)}</p>
            })}
          </div>
        </div>
      </div>
      <div className='col'>
        <canvas id="myCanvas" width="500" height="400"/>
      </div>
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = ( state) => {
  return {
    towns: state.towns.towns,
    town: state.towns.town,
    zctas: state.towns.zctas
  }
}
const mapDispatch = dispatch => {
  return {
    fetchAllTowns: () => dispatch( fetchAllTowns()),
    fetchZCTAs: townGID => dispatch( fetchZCTAs( townGID)),
    fetchTownZCTAs: townGID => dispatch( fetchTownZCTAs( townGID))
  }
}

export default connect(mapState, mapDispatch)(Towns)
