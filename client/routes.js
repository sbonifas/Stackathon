import React, {Component} from 'react'
import { Route} from 'react-router-dom'
import { Towns} from './components'

/**
 * COMPONENT
 */
export default class Routes extends Component {

  render() {

    return (
        <Route component={Towns} />
    )
  }
}
