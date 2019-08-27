import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import PropTypes from 'prop-types'
import React from 'react'
import Button from '../shared/Button'

const DialogComponent = props => {
  return (
    <Dialog
      open={props.isOpen}
      onClose={props.onClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      fullWidth
    >
      <DialogTitle id='alert-dialog-title'>
        {props.title}
      </DialogTitle>

      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {props.content}
        </DialogContentText>
      </DialogContent>

      {props.actions.length > 0 &&
        <DialogActions>
          {props.actions.map((action, index) => {
            const actionProps = action.props || {}

            return (
              <Button
                key={`alert-dialog-action-${index.toString()}`}
                {...actionProps}
              >
                {action.label}
              </Button>
            )
          })}
        </DialogActions>
      }
    </Dialog>
  )
}

DialogComponent.propTypes = {
  actions: PropTypes.array,
  content: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

DialogComponent.defaultProps = {
  actions: [],
  content: 'Are you sure? This cannot be undone.'
}

export default DialogComponent
