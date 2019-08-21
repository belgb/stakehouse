import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import AppBar from '../shared/AppBar'
import Drawer from '../shared/Drawer'
import withMessage from './MessageProvider'

const useStyles = makeStyles(theme => ({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    paddingTop: theme.spacing(3),
    paddingRight: theme.spacing(5),
    paddingBottom: theme.spacing(3),
    paddingLeft: theme.spacing(5)
  }
}))

const withLayout = WrappedComponent => {
  const LayoutProvider = props => {
    const classes = useStyles()
    const [drawerOpen, setDrawerOpen] = useState(false)

    function handleDrawerOpen () {
      setDrawerOpen(true)
    }

    function handleDrawerClose () {
      setDrawerOpen(false)
    }

    return (
      <React.Fragment>
        <AppBar
          appBarTitle={props.appBarTitle}
          drawerIsOpen={drawerOpen}
          onMenuClick={handleDrawerOpen}
        />

        <Drawer
          history={props.history}
          isOpen={drawerOpen}
          onClose={handleDrawerClose}
        />

        <main className={classes.content}>
          <div className={classes.toolbar} />
          <WrappedComponent {...props} />
        </main>

        {props.message}
      </React.Fragment>
    )
  }

  LayoutProvider.propTypes = {
    appBarTitle: PropTypes.string.isRequired
  }

  let Provider = LayoutProvider

  Provider = withMessage(Provider)
  Provider = withRouter(Provider)

  return Provider
}

export default withLayout
