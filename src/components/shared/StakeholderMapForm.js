import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { Formik } from 'formik'
import PropTypes from 'prop-types'
import React from 'react'
import * as Yup from 'yup'
import { MESSAGES } from '../../constants'

const schema = Yup.object().shape({
  name: Yup
    .string()
    .required()
})

const useStyles = makeStyles(theme => ({
  button: {
    marginRight: theme.spacing(2)
  },
  formHelpText: {
    display: 'block',
    marginBottom: theme.spacing(2)
  },
  textField: {
    marginBottom: theme.spacing(3)
  }
}))

const StakeholderMapForm = props => {
  const classes = useStyles()

  return (
    <Formik
      enableReinitialize
      initialValues={props.initialValues}
      onSubmit={props.onSubmit}
      validationSchema={schema}
      render={({
        errors,
        handleChange,
        handleSubmit,
        isSubmitting,
        values
      }) => (
        <form onSubmit={handleSubmit}>
          <Typography
            className={classes.formHelpText}
            variant='caption'
          >
            {MESSAGES.FORM_HELP_TEXT}
          </Typography>
          <TextField
            id='name'
            className={classes.textField}
            label='Name*'
            onChange={handleChange}
            value={values.name}
            variant='outlined'
            error={errors.name !== undefined}
            helperText={errors.name}
          />
          <div>
            <Button
              className={classes.button}
              disabled={isSubmitting}
              onClick={props.onCancel}
              variant='contained'
            >
              Cancel
            </Button>
            <Button
              color='primary'
              disabled={isSubmitting}
              type='submit'
              variant='contained'
            >
              Save
            </Button>
          </div>
        </form>
      )}
    />
  )
}

StakeholderMapForm.propTypes = {
  initialValues: PropTypes.object,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired
}

StakeholderMapForm.defaultProps = {
  initialValues: {
    name: ''
  },
  onCancel: () => {}
}

export default StakeholderMapForm
