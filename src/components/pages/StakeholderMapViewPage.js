import fs from 'fs'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { convertArrayToCSV } from 'convert-array-to-csv'
import { remote } from 'electron'
import log from 'electron-log'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { MESSAGES, PAGES, STAKEHOLDER_SECTORS, STAKEHOLDER_STATUSES } from '../../constants'
import { compilePath } from '../../util/path'
import withLayout from '../providers/LayoutProvider'
import withMappedStakeholders from '../providers/MappedStakeholderProvider'
import withStakeholderMaps from '../providers/StakeholderMapsProvider'
import Button from '../shared/Button'
import Dialog from '../shared/Dialog'
import DropdownField from '../shared/DropdownField'
import EngagementMap from '../shared/EngagementMap'
import PageHeader from '../shared/PageHeader'

const useStyles = makeStyles(theme => ({
  filters: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  filterTitle: {
    paddingBottom: '0 !important'
  }
}))

const StakeholderMapViewPage = props => {
  const classes = useStyles()

  const [isFetchingInitialData, setIsFetchingInitialData] = useState(true)
  const [stakeholders, setStakeholders] = useState([])
  const [stakeholderMap, setStakeholderMap] = useState({})
  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  const [sectorFilter, setSectorFilter] = useState('*')
  const [organisationFilter, setOrganisationFilter] = useState('*')

  useEffect(() => {
    const fetchInitialData = async () => {
      const map = await props.stakeholderMapFindOne({ where: { id: props.stakeholderMapId } })
      const mergedStakeholders = await props.mergedStakeholderFindAll(props.stakeholderMapId)

      if (map === null || mergedStakeholders === null) {
        return false
      }

      setStakeholderMap(map)
      setStakeholders(mergedStakeholders)

      return true
    }

    fetchInitialData().then(success => {
      if (success === false) {
        props.showMessage(MESSAGES.CONTENT.ERROR, MESSAGES.TYPES.ERROR)
        navigateToStakeholderMapListPage()
      }

      setIsFetchingInitialData(false)
    })
  }, [])

  const sortFilterOptions = (a, b) => {
    if (a.value === '*') {
      return 1
    }

    let order = 0

    if (a.labelText < b.labelText) {
      order = -1
    } else if (a.labelText > b.labelText) {
      order = 1
    }

    return order
  }

  const getSectorOptions = () => {
    const existingSectors = stakeholders.reduce((result, s) => {
      result[s.sector] = STAKEHOLDER_SECTORS[s.sector]
      return result
    }, {})

    const sectors = { ...existingSectors, '*': 'All' }

    return Object
      .keys(sectors)
      .map(key => ({
        labelText: sectors[key],
        value: key
      }))
      .sort(sortFilterOptions)
  }

  const getOrganisationOptions = () => {
    const existingOrganisations = stakeholders.reduce((result, s) => {
      if (sectorFilter === '*' || sectorFilter === s.sector) {
        result[s.organisation] = s.organisation
      }

      return result
    }, {})

    const organisations = { ...existingOrganisations, '*': 'All' }

    return Object
      .keys(organisations)
      .map(key => ({
        labelText: organisations[key],
        value: key
      }))
      .sort(sortFilterOptions)
  }

  const getFilteredStakeholders = () => {
    return stakeholders.filter(s => {
      if (sectorFilter !== '*' && sectorFilter !== s.sector) {
        return false
      }

      if (organisationFilter !== '*' && organisationFilter !== s.organisation) {
        return false
      }

      return true
    })
  }

  const handleFilterChange = event => {
    switch (event.target.id) {
      case 'sectorFilter':
        setSectorFilter(event.target.value)
        setOrganisationFilter('*')
        break

      case 'organisationFilter':
        setOrganisationFilter(event.target.value)
        break

      default:
        break
    }
  }

  const handleStakeholderClick = id => {
    props.history.push(compilePath(PAGES.MAPPED_STAKEHOLDER_VIEW.PATH, { stakeholderMapId: props.stakeholderMapId, stakeholderId: id }))
  }

  const handleAddStakeholder = () => {
    props.history.push(compilePath(PAGES.MAPPED_STAKEHOLDER_ADD_TO_MAP.PATH, { id: props.stakeholderMapId }))
  }

  const handleEditStakeholderMap = () => {
    props.history.push(compilePath(PAGES.STAKEHOLDER_MAP_EDIT.PATH, { id: props.stakeholderMapId }))
  }

  const navigateToStakeholderMapListPage = () => {
    props.history.push(PAGES.STAKEHOLDER_MAP_LIST.PATH)
  }

  const handleShowDialog = () => {
    setDialogIsOpen(true)
  }

  const handleDialogClose = () => {
    setDialogIsOpen(false)
  }

  const handleConfirmRemove = () => {
    props
      .stakeholderMapDestroy({ where: { id: props.stakeholderMapId } })
      .then(numberOfRowsDestroyed => {
        if (numberOfRowsDestroyed === null) {
          props.showMessage(MESSAGES.CONTENT.ERROR, MESSAGES.TYPES.ERROR)
        } else {
          props.showMessage(MESSAGES.CONTENT.SUCCESS, MESSAGES.TYPES.SUCCESS)
        }

        navigateToStakeholderMapListPage()
      })
  }

  const handleExportStakeholderMap = () => {
    remote.dialog.showSaveDialog(
      remote.getCurrentWindow(),
      {
        buttonLabel: 'Export',
        defaultPath: `engagement-map.csv`,
        title: `Export "${stakeholderMap.name}" as CSV`
      },
      filePath => {
        if (filePath === undefined) {
          return
        }

        const excludeKeys = ['createdAt', 'id', 'stakeholderMapId', 'updatedAt']

        const data = stakeholders.map(item => {
          return Object
            .keys(item)
            .reduce((result, key) => {
              if (excludeKeys.indexOf(key) !== -1) {
                return result
              }

              if (key === 'relationshipStatus') {
                result[`${key}Label`] = STAKEHOLDER_STATUSES[item[key]]
              }

              if (key === 'sector') {
                result[`${key}Label`] = STAKEHOLDER_SECTORS[item[key]]
              }

              result['commsGroup'] = props.mappedStakeholderCommsGroup(item.influence, item.interest)
              result['commsResponse'] = props.mappedStakeholderCommsResponse(item.influence, item.interest)

              result[key] = item[key]

              return result
            }, {})
        })

        fs.writeFile(filePath, convertArrayToCSV(data), error => {
          if (error) {
            log.error(error)
            props.showMessage(MESSAGES.CONTENT.ERROR, MESSAGES.TYPES.ERROR)
          } else {
            props.showMessage(MESSAGES.CONTENT.SUCCESS, MESSAGES.TYPES.SUCCESS)
          }
        })
      }
    )
  }

  if (stakeholderMap === null) {
    return null
  }

  return (
    <React.Fragment>
      <PageHeader
        actions={[
          {
            value: 'Edit',
            onClick: handleEditStakeholderMap
          },
          {
            value: 'Export',
            onClick: handleExportStakeholderMap
          },
          {
            value: 'Delete',
            onClick: handleShowDialog
          }
        ]}
        onBackClick={navigateToStakeholderMapListPage}
        title={stakeholderMap.name || ''}
      />

      {stakeholders.length === 0 && isFetchingInitialData === false &&
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            xs={12}
          >
            <Typography
              variant='subtitle1'
              gutterBottom
            >
              To create your map, start by adding a stakeholder or partner.
            </Typography>
          </Grid>
        </Grid>
      }

      {isFetchingInitialData === false &&
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
              onClick={handleAddStakeholder}
              variant='contained'
            >
              Add stakeholder or partner to map
            </Button>
          </Grid>
        </Grid>
      }

      {stakeholders.length > 0 &&
        <React.Fragment>
          <Grid
            className={classes.filters}
            container
            spacing={3}
          >
            <Grid
              className={classes.filterTitle}
              item
              xs={12}
            >
              <Typography
                component='h3'
                variant='h6'
              >
                Filter by:
              </Typography>
            </Grid>
            <Grid
              item
              xs={4}
            >
              <DropdownField
                id='sectorFilter'
                labelText='Sector'
                onChange={handleFilterChange}
                options={getSectorOptions()}
                value={sectorFilter}
              />
            </Grid>
            <Grid
              item
              xs={4}
            >
              <DropdownField
                id='organisationFilter'
                labelText='Organisation'
                onChange={handleFilterChange}
                options={getOrganisationOptions()}
                value={organisationFilter}
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
            >
              <EngagementMap
                height={600}
                onStakeholderClick={handleStakeholderClick}
                stakeholders={getFilteredStakeholders()}
                width={1024}
              />
            </Grid>
          </Grid>
        </React.Fragment>
      }

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
              onClick: handleConfirmRemove
            }
          }
        ]}
        isOpen={dialogIsOpen}
        onClose={handleDialogClose}
        title={`Delete "${stakeholderMap.name}"`}
      />
    </React.Fragment>
  )
}

StakeholderMapViewPage.propTypes = {
  stakeholderMapId: PropTypes.string.isRequired
}

let Page = StakeholderMapViewPage

Page = withLayout(Page)
Page = withMappedStakeholders(Page)
Page = withStakeholderMaps(Page)

export default Page
