import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import React from 'react'

const useStyles = makeStyles(theme => ({
  button: {
    boxShadow: theme.shadows[0]
  }
}))

const ButtonComponent = props => {
  const classes = useStyles()

  return (
    <Button
      {...props}
      className={clsx(classes.button, props.className)}
    />
  )
}

export default ButtonComponent
