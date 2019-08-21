import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputLabel from '@material-ui/core/InputLabel'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import Select from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'

const useStyles = makeStyles(theme => ({
  formControl: {
    minWidth: '100%'
  }
}))

const DropdownField = props => {
  const classes = useStyles()

  const inputLabel = useRef(null)
  const [labelWidth, setLabelWidth] = useState(0)

  useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth)
  }, [])

  return (
    <FormControl
      className={classes.formControl}
      variant='outlined'
    >
      <InputLabel
        ref={inputLabel}
        htmlFor={props.id}
        error={props.error}
      >
        {props.labelText}
      </InputLabel>
      <Select
        native
        error={props.error}
        value={props.value}
        onChange={props.onChange}
        disabled={props.disabled}
        input={
          <OutlinedInput
            id={props.id}
            labelWidth={labelWidth}
          />
        }
      >
        {props.options.map(option => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled === true}
          >
            {option.labelText}
          </option>
        ))}
      </Select>
      {props.helperText !== '' &&
        <FormHelperText error={props.error}>
          {props.helperText}
        </FormHelperText>
      }
    </FormControl>
  )
}

DropdownField.propTypes = {
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  id: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  value: PropTypes.string
}

DropdownField.defaultProps = {
  disabled: false,
  error: false,
  helperText: '',
  value: ''
}

export default DropdownField
