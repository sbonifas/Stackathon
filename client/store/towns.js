import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_TOWNS = 'GET_TOWNS'
const GET_TOWN = 'GET_TOWN'
const GET_ZCTAS = 'GET_ZCTAS'
const SET_TOWN_AREA = 'SET_TOWN_AREA'

/**
 * INITIAL STATE
 */
const defaultState = { towns: [], town: [], zctas: [], townArea: 0}

/**
 * ACTION CREATORS
 */
const getTowns = towns => ({type: GET_TOWNS, towns})
const getTown = town => ({type: GET_TOWN, town})
const getZCTAs = zctas => ({type: GET_ZCTAS, zctas})
const setTownArea = townArea => ({type: SET_TOWN_AREA, townArea})

/**
 * THUNK CREATORS
 */
export const fetchAllTowns = () => async dispatch => {
  try {
    const res = await axios.get('/api/towns')
    dispatch( getTowns( res.data))
  } catch ( err) {
    console.error( err)
  }
}
export const fetchTownZCTAs = ( townGID) => async dispatch => {
  try {
    const res = await axios.get(`/api/towns/name/${townGID}`)
    dispatch( getTown( res.data.towns))
    const townArea = res.data.towns.reduce( (totalArea, town) => {
      return totalArea + town.square_mil
    }, 0)
    dispatch( setTownArea( townArea))
    dispatch( getZCTAs( res.data.zctas))
  } catch ( err) {
    console.error( err)
  }
}
export const fetchZCTAs = ( townGID) => async dispatch => {
  try {
    const res = await axios.get(`/api/towns/${townGID}`)
    dispatch( getTown( res.data.town))
    dispatch( setTownArea( res.data.town[ 0].square_mil))
    dispatch( getZCTAs( res.data.zctas))
  } catch ( err) {
    console.error( err)
  }
}


/**
 * REDUCER
 */
export default function(state = defaultState, action) {
  switch (action.type) {
    case GET_TOWNS:
      return { ...state, towns: action.towns}
    case GET_TOWN:
      return { ...state, town: action.town}
    case SET_TOWN_AREA:
      return { ...state, townArea: action.townArea}
    case GET_ZCTAS:
      return { ...state, zctas: action.zctas}
    default:
      return state
  }
}
