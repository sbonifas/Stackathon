import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_TOWNS = 'GET_TOWNS'
const GET_TOWN = 'GET_TOWN'
const GET_ZCTAS = 'GET_ZCTAS'

/**
 * INITIAL STATE
 */
const defaultState = { towns: [], town: [], zctas: []}

/**
 * ACTION CREATORS
 */
const getTowns = towns => ({type: GET_TOWNS, towns})
const getTown = town => ({type: GET_TOWN, town})
const getZCTAs = zctas => ({type: GET_ZCTAS, zctas})

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
    dispatch( getZCTAs( res.data.zctas))
  } catch ( err) {
    console.error( err)
  }
}
export const fetchZCTAs = ( townGID) => async dispatch => {
  try {
    const res = await axios.get(`/api/towns/${townGID}`)
    dispatch( getTown( res.data.town))
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
    case GET_ZCTAS:
      return { ...state, zctas: action.zctas}
    default:
      return state
  }
}
