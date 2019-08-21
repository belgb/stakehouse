import CssBaseline from '@material-ui/core/CssBaseline'
import log from 'electron-log'
import React from 'react'
import ErrorPage from '../pages/ErrorPage'
import FallbackProgress from '../shared/FallbackProgress'
import Authenticated from './Authenticated'

class Wrapper extends React.Component {
  static getDerivedStateFromError () {
    return {
      hasError: true
    }
  }

  constructor (props) {
    super(props)

    this.state = {
      hasError: false
    }
  }

  componentDidCatch (error, info) {
    log.error(error, info)
  }

  render () {
    return (
      <React.Suspense fallback={<FallbackProgress />}>
        <CssBaseline />

        {this.state.hasError
          ? <ErrorPage
            {...this.props}
            appBarTitle='Error'
          />
          : <Authenticated {...this.props} />
        }
      </React.Suspense>
    )
  }
}

const App = Wrapper

export default App
