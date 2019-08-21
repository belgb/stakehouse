import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/Delete'
import VisibilityIcon from '@material-ui/icons/Visibility'
import React, { useEffect, useState } from 'react'
import { MESSAGES, PAGES } from '../../constants'
import { compilePath } from '../../util/path'
import withLayout from '../providers/LayoutProvider'
import withStakeholderMaps from '../providers/StakeholderMapsProvider'
import Dialog from '../shared/Dialog'
import Table from '../shared/Table'

const useStyles = makeStyles(theme => ({
  action: {
    marginRight: theme.spacing(2)
  }
}))

const StakeholderMapListPage = props => {
  const classes = useStyles()

  const [activeStakeholderMap, setActiveStakeholderMap] = useState({})
  const [stakeholderMaps, setStakeholderMaps] = useState([])

  const handleShowDialog = item => {
    return () => {
      setActiveStakeholderMap(item)
    }
  }

  const handleDialogClose = () => {
    setActiveStakeholderMap({})
  }

  const handleConfirmDelete = () => {
    props
      .stakeholderMapDestroy({ where: { id: activeStakeholderMap.id } })
      .then(rowsDestroyed => {
        if (rowsDestroyed === null) {
          props.showMessage(MESSAGES.CONTENT.ERROR, MESSAGES.TYPES.ERROR)
        } else {
          props.showMessage(MESSAGES.CONTENT.SUCCESS, MESSAGES.TYPES.SUCCESS)
        }

        setStakeholderMaps(stakeholderMaps.filter(item => item.id !== activeStakeholderMap.id))

        handleDialogClose()
      })
  }

  const handleNavigateStakeholderMapAdd = () => {
    props.history.push(PAGES.STAKEHOLDER_MAP_CREATE.PATH)
  }

  const handleNavigateStakeholderMapEdit = id => {
    return () => {
      props.history.push(compilePath(PAGES.STAKEHOLDER_MAP_VIEW.PATH, { id }))
    }
  }

  useEffect(() => {
    props
      .stakeholderMapFindAll()
      .then(items => {
        setStakeholderMaps(items)
      })
  }, [])

  return (
    <Grid
      container
      spacing={3}
    >
      <Grid
        item
        xs={12}
      >
        <Button
          color='primary'
          onClick={handleNavigateStakeholderMapAdd}
          variant='contained'
        >
          Create engagement map
        </Button>
      </Grid>

      <Grid
        item
        xs={12}
      >
        {stakeholderMaps.length > 0
          ? <Table
            id='maps'
            head={['Name', 'Actions']}
            body={stakeholderMaps.map(item => {
              const actions = (
                <React.Fragment>
                  <IconButton
                    className={classes.action}
                    aria-label='View'
                    color='inherit'
                    edge='start'
                    onClick={handleNavigateStakeholderMapEdit(item.id)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    className={classes.action}
                    aria-label='Delete'
                    color='inherit'
                    edge='start'
                    onClick={handleShowDialog(item)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </React.Fragment>
              )

              return [item.name, actions]
            })}
          />
          : <Typography
            variant='subtitle1'
            gutterBottom
          >
              Start by creating your first engagement map.
          </Typography>
        }
      </Grid>

      <Dialog
        actions={[
          {
            label: 'Cancel',
            props: {
              onClick: handleDialogClose
            }
          },
          {
            label: 'Yes, delete',
            props: {
              color: 'primary',
              onClick: handleConfirmDelete
            }
          }
        ]}
        isOpen={activeStakeholderMap.id !== undefined}
        onClose={handleDialogClose}
        title={activeStakeholderMap.id === undefined ? '' : `Delete "${activeStakeholderMap.name}"`}
      />
    </Grid>
  )
}

let Page = StakeholderMapListPage

Page = withLayout(Page)
Page = withStakeholderMaps(Page)

export default Page
