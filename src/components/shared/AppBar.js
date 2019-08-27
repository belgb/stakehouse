import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import MenuIcon from '@material-ui/icons/Menu'
import clsx from 'clsx'
import React from 'react'
import PropTypes from 'prop-types'
import { LAYOUT } from '../../constants'

const useStyles = makeStyles(theme => ({
  appBar: {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.primary.light,
    borderBottom: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[0],
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: LAYOUT.DRAWER_WIDTH,
    width: `calc(100% - ${LAYOUT.DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 54
  }
}))

const AppBarComponent = props => {
  const classes = useStyles()

  return (
    <AppBar
      position='fixed'
      className={clsx(classes.appBar, {
        [classes.appBarShift]: props.drawerIsOpen
      })}
    >
      <Toolbar>
        <IconButton
          color='inherit'
          aria-label='open drawer'
          onClick={props.onMenuClick}
          edge='start'
          className={clsx(classes.menuButton, {
            [classes.hide]: props.drawerIsOpen
          })}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant='h6' noWrap>
          {props.appBarTitle}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

AppBarComponent.propTypes = {
  appBarTitle: PropTypes.string.isRequired,
  drawerIsOpen: PropTypes.bool.isRequired,
  onMenuClick: PropTypes.func.isRequired
}

export default AppBarComponent
