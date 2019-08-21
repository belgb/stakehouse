import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { LAYOUT } from '../../constants'

const MoreMenu = props => {
  const [selectedValue, setSelectedValue] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const isOpen = anchorEl !== null

  const handleOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setSelectedValue(null)
    props.onClose()
  }

  const handleItemClick = ({ onClick, value }) => {
    return event => {
      setSelectedValue(value)
      onClick(event, value)
      handleClose()
    }
  }

  return (
    <div>
      <IconButton
        aria-label='more'
        aria-controls='long-menu'
        aria-haspopup='true'
        onClick={handleOpen}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={isOpen}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: LAYOUT.MENU_ITEM_HEIGHT * 4.5,
            width: 200
          }
        }}
      >
        {props.options.map(option => (
          <MenuItem
            key={option.value}
            selected={option.value === selectedValue}
            onClick={handleItemClick(option)}
          >
            {option.value}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

MoreMenu.propTypes = {
  onClose: PropTypes.func,
  options: PropTypes.array.isRequired
}

MoreMenu.defaultProps = {
  onClose: () => {}
}

export default MoreMenu
