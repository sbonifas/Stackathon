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
  changeTown( event) {
    if (this.allTowns) {
      this.props.fetchTownZCTAs( event.target.value)
    } else {
      this.props.fetchZCTAs( event.target.value)
    }
  }
  allTownName( event) {
    this.allTowns = event.target.checked
  }

  render() {
    return (
      <div>
        <form>
          <label>Towns</label>
          <select name="town" onChange={ this.changeTown}>
            {this.props.towns.map( town => {
              return <option value={ town.gid} key={ town.gid}>  { town.town} - { Number( town.square_mil).toFixed(2)} sq. mi.</option>
            })}
          </select>
          <input type='checkbox' name='All Towns' onClick={ this.allTownName} />Include all polygons with the same town name.
          </form>
          <h2>Zip Code Tabulation Areas</h2>
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
