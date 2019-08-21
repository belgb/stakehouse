import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { MESSAGES, PAGES, STAKEHOLDER_SECTORS, STAKEHOLDER_STATUSES } from '../../constants'
import { compilePath } from '../../util/path'
import withLayout from '../providers/LayoutProvider'
import withMappedStakeholders from '../providers/MappedStakeholderProvider'
import withStakeholders from '../providers/StakeholderProvider'
import withStakeholderMaps from '../providers/StakeholderMapsProvider'
import Dialog from '../shared/Dialog'
import PageHeader from '../shared/PageHeader'

const useStyles = makeStyles(theme => ({
  card: {
    marginBottom: theme.spacing(1)
  },
  section: {
    marginBottom: theme.spacing(1)
  }
}))

const MappedStakeholderViewPage = props => {
  const classes = useStyles()

  const [mappedStakeholder, setMappedStakeholder] = useState(null)
  const [stakeholder, setStakeholder] = useState(null)
  const [stakeholderMap, setStakeholderMap] = useState(null)
  const [dialogIsOpen, setDialogIsOpen] = useState(false)

  useEffect(() => {
    const fetchInitialData = async () => {
      const map = await props.stakeholderMapFindOne({ where: { id: props.stakeholderMapId } })

      const msh = await props.mappedStakeholderFindOne({
        where: {
          stakeholderId: props.stakeholderId,
          stakeholderMapId: props.stakeholderMapId
        }
      })

      const sh = await props.stakeholderFindOne({ where: { id: props.stakeholderId } })

      if (map === null || msh === null || sh === null) {
        return false
      }

      setStakeholderMap(map)
      setMappedStakeholder(msh)
      setStakeholder(sh)

      return true
    }

    fetchInitialData().then(success => {
      if (success === false) {
        props.showMessage(MESSAGES.CONTENT.ERROR, MESSAGES.TYPES.ERROR)
        navigateToStakeholderMapViewPage()
      }
    })
  }, [])

  const navigateToStakeholderMapViewPage = () => {
    props.history.push(compilePath(PAGES.STAKEHOLDER_MAP_VIEW.PATH, { id: props.stakeholderMapId }))
  }

  const navigateToMappedStakeholderEditPage = () => {
    props.history.push(compilePath(PAGES.MAPPED_STAKEHOLDER_EDIT.PATH, { stakeholderMapId: props.stakeholderMapId, stakeholderId: props.stakeholderId }))
  }

  const handleShowDialog = () => {
    setDialogIsOpen(true)
  }

  const handleDialogClose = () => {
    setDialogIsOpen(false)
  }

  const handleConfirmRemove = () => {
    props
      .mappedStakeholderDestroy({
        where: {
          stakeholderId: props.stakeholderId,
          stakeholderMapId: props.stakeholderMapId
        }
      })
      .then(numberOfRowsDestroyed => {
        if (numberOfRowsDestroyed === null) {
          props.showMessage(MESSAGES.CONTENT.ERROR, MESSAGES.TYPES.ERROR)
        } else {
          props.showMessage(MESSAGES.CONTENT.SUCCESS, MESSAGES.TYPES.SUCCESS)
        }

        navigateToStakeholderMapViewPage()
      })
  }

  if (mappedStakeholder === null || stakeholder === null) {
    return null
  }

  return (
    <React.Fragment>
      <PageHeader
        actions={[
          {
            value: 'Edit',
            onClick: navigateToMappedStakeholderEditPage
          },
          {
            value: 'Remove',
            onClick: handleShowDialog
          }
        ]}
        onBackClick={navigateToStakeholderMapViewPage}
        title={stakeholder !== null ? `${stakeholder.firstName} ${stakeholder.surname}` : ''}
      />

      <Grid
        className={classes.section}
        container
        spacing={3}
      >
        <Grid
          item
          xs={12}
        >
          <Card className={classes.card}>
            <CardContent>
              <Typography
                color='textSecondary'
                gutterBottom
              >
                Communications strategy
              </Typography>
              <Typography
                component='h2'
                variant='h5'
              >
                {props.mappedStakeholderCommsGroup(mappedStakeholder.influence, mappedStakeholder.interest)}
              </Typography>
              <Typography
                component='p'
                variant='body2'
              >
                {props.mappedStakeholderCommsResponse(mappedStakeholder.influence, mappedStakeholder.interest)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid
        className={classes.section}
        container
        spacing={3}
      >
        <Grid
          item
          xs={12}
          md={4}
        >
          <Typography
            component='h4'
            variant='h5'
          >
            Organisation
          </Typography>
          <Typography component='p'>
            {stakeholder.organisation}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
        >
          <Typography
            component='h4'
            variant='h5'
          >
            Position
          </Typography>
          <Typography component='p'>
            {stakeholder.position}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
        >
          <Typography
            component='h4'
            variant='h5'
          >
            Sector
          </Typography>
          <Typography component='p'>
            {STAKEHOLDER_SECTORS[stakeholder.sector]}
          </Typography>
        </Grid>
      </Grid>

      <Grid
        className={classes.section}
        container
        spacing={3}
      >
        <Grid
          item
          xs={12}
          md={4}
        >
          <Typography
            component='h4'
            variant='h5'
          >
            Relationship status
          </Typography>
          <Typography component='p'>
            {STAKEHOLDER_STATUSES[mappedStakeholder.relationshipStatus]}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
        >
          <Typography
            component='h4'
            variant='h5'
          >
            Owner
          </Typography>
          <Typography component='p'>
            {mappedStakeholder.relationshipOwner || 'Not assigned'}
          </Typography>
        </Grid>
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
            label: 'Yes, remove',
            props: {
              color: 'primary',
              onClick: handleConfirmRemove
            }
          }
        ]}
        isOpen={dialogIsOpen}
        onClose={handleDialogClose}
        title={`Remove "${stakeholder.firstName} ${stakeholder.surname}" from "${stakeholderMap.name}"`}
      />
    </React.Fragment>
  )
}

MappedStakeholderViewPage.propTypes = {
  stakeholderId: PropTypes.string.isRequired,
  stakeholderMapId: PropTypes.string.isRequired
}

let Page = MappedStakeholderViewPage

Page = withLayout(Page)
Page = withMappedStakeholders(Page)
Page = withStakeholders(Page)
Page = withStakeholderMaps(Page)

export default Page
