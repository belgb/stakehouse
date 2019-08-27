import Box from '@material-ui/core/Box'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'
import React from 'react'
import MoreMenu from './MoreMenu'

const useStyles = makeStyles(theme => ({
  backButton: {
    marginRight: theme.spacing(2)
  },
  divider: {
    marginBottom: theme.spacing(4)
  },
  pageHeader: {
    marginBottom: theme.spacing(2)
  }
}))

const PageHeader = props => {
  const classes = useStyles()

  return (
    <Box>
      <Box
        className={classes.pageHeader}
        display='flex'
        alignItems='center'
        justifyContent='space-between'
      >
        <Box
          display='flex'
          alignItems='center'
        >
          {props.onBackClick !== null &&
            <IconButton
              className={classes.backButton}
              onClick={props.onBackClick}
            >
              <ChevronLeftIcon />
            </IconButton>
          }

          <Typography
            variant='h3'
            component='h1'
          >
            {props.title}
          </Typography>
        </Box>

        {props.actions.length > 0 &&
          <MoreMenu options={props.actions} />
        }
      </Box>

      <Divider className={classes.divider} />
    </Box>

  )
}

PageHeader.propTypes = {
  actions: PropTypes.array,
  onBackClick: PropTypes.func,
  title: PropTypes.string.isRequired
}

PageHeader.defaultProps = {
  actions: [],
  onBackClick: null
}

export default PageHeader
