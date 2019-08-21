import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import CategoryIcon from '@material-ui/icons/Category'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import React from 'react'
import { LAYOUT, PAGES } from '../../constants'

const useStyles = makeStyles(theme => ({
  drawer: {
    width: LAYOUT.DRAWER_WIDTH,
    flexShrink: 0,
    whiteSpace: 'nowrap'
  },
  drawerOpen: {
    width: LAYOUT.DRAWER_WIDTH,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    width: theme.spacing(9) + 1
  },
  listItem: {
    paddingLeft: theme.spacing(3)
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  }
}))

const DrawerComponent = props => {
  const classes = useStyles()

  const handleListItemClick = (path) => {
    return () => {
      props.history.push(path)
    }
  }

  return (
    <Drawer
      classes={{
        paper: clsx({
          [classes.drawerOpen]: props.isOpen,
          [classes.drawerClose]: !props.isOpen
        })
      }}
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: props.isOpen,
        [classes.drawerClose]: !props.isOpen
      })}
      open={props.isOpen}
      variant='permanent'
    >
      <div className={classes.toolbar}>
        <IconButton onClick={props.onClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>

      <Divider />

      <List>
        <ListItem
          button
          className={classes.listItem}
          onClick={handleListItemClick(PAGES.STAKEHOLDER_MAP_LIST.PATH)}
        >
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary='Engagement Maps' />
        </ListItem>
      </List>
    </Drawer>
  )
}

DrawerComponent.propTypes = {
  history: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default DrawerComponent
