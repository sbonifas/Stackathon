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
  async changeTown( event) {
    if (this.allTowns) {
      await this.props.fetchTownZCTAs( event.target.value)
    } else {
      await this.props.fetchZCTAs( event.target.value)
    }
    const coords = this.props.town.geom.coordinates[0][0]
    const minMax = coords.reduce(( vals, coord) => {
      if ( coord[0] < vals[0]) vals[0] = coord[0]
      if ( coord[1] < vals[1]) vals[1] = coord[1]
      if ( coord[0] > vals[2]) vals[2] = coord[0]
      if ( coord[1] > vals[3]) vals[3] = coord[1]
      return vals
    }, [ ...coords[0], ...coords[0]])
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    const scale = ( ( 500 / (minMax[2] - minMax[0])) < ( 400 / (minMax[3] - minMax[1]))) ? 500 / (minMax[2] - minMax[0]) : 400 / (minMax[3] - minMax[1])
    console.log( 'Inside Towns component, scale:\n', scale)
    console.log( 'Inside Towns component, minMax:\n', minMax)
    console.log( 'Inside Towns component, this.props.town.geom.coordinates:\n', this.props.town.geom.coordinates)
    ctx.setTransform()
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.transform( scale, 0, 0, scale, -minMax[0] * scale, -minMax[1] * scale)
    ctx.beginPath()
    ctx.moveTo( coords[0][0], minMax[3] + minMax[ 1] - coords[ 0][ 1]);
    coords.slice( 1).forEach( coord => {
      ctx.lineTo( coord[ 0], minMax[3] + minMax[ 1] - coord[ 1])
    })
    // ctx.closePath()
    ctx.lineWidth = Math.ceil( 1 / scale)
    ctx.strokeStyle = '#00FF00'
    ctx.stroke()
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
