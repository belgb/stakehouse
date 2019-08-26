import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { Formik } from 'formik'
import PropTypes from 'prop-types'
import React from 'react'
import * as Yup from 'yup'
import { MESSAGES, STAKEHOLDER_SECTORS, STAKEHOLDER_STATUSES } from '../../constants'
import DropdownField from '../shared/DropdownField'

const useStyles = makeStyles(theme => ({
  button: {
    marginRight: theme.spacing(2)
  },
  formHelpText: {
    display: 'block',
    marginBottom: theme.spacing(2)
  },
  formSection: {
    marginBottom: theme.spacing(3)
  }
}))

const schema = Yup.object().shape({
  firstName: Yup
    .string()
    .required('Please enter a first name'),
  id: Yup
    .string(),
  influence: Yup
    .number()
    .typeError('Please enter a number from 1 to 10')
    .min(1, 'Please enter a number from 1 to 10')
    .max(10, 'Please enter a number from 1 to 10')
    .required('Please enter a number from 1 to 10'),
  interest: Yup
    .number()
    .typeError('Please enter a number from 1 to 10')
    .min(1, 'Please enter a number from 1 to 10')
    .max(10, 'Please enter a number from 1 to 10')
    .required('Please enter a number from 1 to 10'),
  organisation: Yup
    .string()
    .required('Please enter an organisation'),
  position: Yup
    .string(),
  relationshipOwner: Yup
    .string(),
  relationshipStatus: Yup
    .string()
    .required('Please choose a relationship status'),
  sector: Yup
    .string()
    .required('Please choose a sector'),
  surname: Yup
    .string()
    .required('Please enter a surname')
})

const sectorOptions = [
  { labelText: '', value: '' },
  ...Object.keys(STAKEHOLDER_SECTORS).map(key => {
    return {
      labelText: STAKEHOLDER_SECTORS[key],
      value: key
    }
  })
]

const relationshipStatusOptions = [
  { labelText: '', value: '' },
  ...Object.keys(STAKEHOLDER_STATUSES).map(key => {
    return {
      labelText: STAKEHOLDER_STATUSES[key],
      value: key
    }
  })
]

export const stakeholderInitialValues = {
  firstName: '',
  id: '',
  organisation: '',
  position: '',
  sector: '',
  surname: ''
}

export const mappedStakeholderInitialValues = {
  influence: '',
  interest: '',
  relationshipOwner: '',
  relationshipStatus: ''
}

export const initialValues = {
  ...stakeholderInitialValues,
  ...mappedStakeholderInitialValues
}

const MappedStakeholderForm = props => {
  const classes = useStyles()

  const handleFieldChange = formikHandleChange => {
    return event => {
      formikHandleChange(event)
      props.onChange(event)
    }
  }

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
        touched,
        values
      }) => (
        <form onSubmit={handleSubmit}>
          <Typography
            className={classes.formHelpText}
            variant='caption'
          >
            {MESSAGES.FORM_HELP_TEXT}
          </Typography>
          <input
            id='id'
            type='hidden'
            value={values.id}
          />
          <div className={classes.formSection}>
            <Typography
              variant='h4'
              component='h2'
              gutterBottom
            >
              Who
            </Typography>

            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                xs={12}
                sm={6}
              >
                <DropdownField
                  id='sector'
                  labelText='Sector*'
                  onChange={handleFieldChange(handleChange)}
                  options={sectorOptions}
                  value={values.sector}
                  disabled={props.disabledFields.indexOf('sector') !== -1}
                  error={errors.sector && touched.sector}
                  helperText={errors.sector && touched.sector ? errors.sector : ''}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
              >
                <TextField
                  fullWidth
                  id='organisation'
                  label='Organisation*'
                  onChange={handleFieldChange(handleChange)}
                  value={values.organisation}
                  disabled={props.disabledFields.indexOf('organisation') !== -1}
                  variant='outlined'
                  error={errors.organisation && touched.organisation}
                  helperText={errors.organisation && touched.organisation ? errors.organisation : ''}
                />
              </Grid>
            </Grid>

            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                xs={12}
                sm={6}
              >
                <TextField
                  fullWidth
                  id='firstName'
                  label='First name*'
                  onChange={handleFieldChange(handleChange)}
                  value={values.firstName}
                  disabled={props.disabledFields.indexOf('firstName') !== -1}
                  variant='outlined'
                  error={errors.firstName && touched.firstName}
                  helperText={errors.firstName && touched.firstName ? errors.firstName : ''}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
              >
                <TextField
                  fullWidth
                  id='surname'
                  label='Surname*'
                  onChange={handleFieldChange(handleChange)}
                  value={values.surname}
                  disabled={props.disabledFields.indexOf('surname') !== -1}
                  variant='outlined'
                  error={errors.surname && touched.surname}
                  helperText={errors.surname && touched.surname ? errors.surname : ''}
                />
              </Grid>
            </Grid>

            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                xs={12}
                sm={6}
              >
                <TextField
                  fullWidth
                  id='position'
                  label='Position'
                  onChange={handleFieldChange(handleChange)}
                  value={values.position}
                  disabled={props.disabledFields.indexOf('position') !== -1}
                  variant='outlined'
                  error={errors.position && touched.position}
                  helperText={errors.position && touched.position ? errors.position : ''}
                />
              </Grid>
            </Grid>
          </div>

          <div className={classes.formSection}>
            <Typography
              variant='h4'
              component='h2'
              gutterBottom
            >
              Interest and influence
            </Typography>

            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                xs={12}
                sm={6}
              >
                <TextField
                  fullWidth
                  id='interest'
                  label='Interest*'
                  onChange={handleFieldChange(handleChange)}
                  type='number'
                  value={values.interest}
                  disabled={props.disabledFields.indexOf('interest') !== -1}
                  variant='outlined'
                  error={errors.interest && touched.interest}
                  helperText={errors.interest && touched.interest ? errors.interest : 'From 1 to 10 (Uninterested — extremely interested)'}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
              >
                <TextField
                  fullWidth
                  id='influence'
                  label='Influence*'
                  onChange={handleFieldChange(handleChange)}
                  type='number'
                  value={values.influence}
                  disabled={props.disabledFields.indexOf('influence') !== -1}
                  variant='outlined'
                  error={errors.influence && touched.influence}
                  helperText={errors.influence && touched.influence ? errors.influence : 'From 1 to 10 (uninfluential — extremely influential)'}
                />
              </Grid>
            </Grid>
          </div>

          <div className={classes.formSection}>
            <Typography
              variant='h4'
              component='h2'
              gutterBottom
            >
              Relationship
            </Typography>

            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                xs={12}
                sm={6}
              >
                <DropdownField
                  id='relationshipStatus'
                  labelText='Status*'
                  onChange={handleFieldChange(handleChange)}
                  options={relationshipStatusOptions}
                  value={values.relationshipStatus}
                  disabled={props.disabledFields.indexOf('relationshipStatus') !== -1}
                  error={errors.relationshipStatus && touched.relationshipStatus}
                  helperText={errors.relationshipStatus && touched.relationshipStatus ? errors.relationshipStatus : ''}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
              >
                <TextField
                  fullWidth
                  id='relationshipOwner'
                  label='Owner'
                  onChange={handleFieldChange(handleChange)}
                  value={values.relationshipOwner}
                  disabled={props.disabledFields.indexOf('relationshipOwner') !== -1}
                  variant='outlined'
                  error={errors.relationshipOwner && touched.relationshipOwner}
                  helperText={errors.relationshipOwner && touched.relationshipOwner ? errors.relationshipOwner : ''}
                />
              </Grid>
            </Grid>
          </div>

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
              {props.submitButtonLabel}
            </Button>
          </div>
        </form>
      )}
    />
  )
}

MappedStakeholderForm.propTypes = {
  disabledFields: PropTypes.array,
  initialValues: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string
}

MappedStakeholderForm.defaultProps = {
  disabledFields: [],
  initialValues,
  onChange: () => {},
  submitButtonLabel: 'Save'
}

export default MappedStakeholderForm
