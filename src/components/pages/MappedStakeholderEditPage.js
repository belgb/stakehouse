import Grid from '@material-ui/core/Grid'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { MESSAGES, PAGES } from '../../constants'
import { compilePath } from '../../util/path'
import withLayout from '../providers/LayoutProvider'
import withMappedStakeholders from '../providers/MappedStakeholderProvider'
import withStakeholders from '../providers/StakeholderProvider'
import withStakeholderMaps from '../providers/StakeholderMapsProvider'
import MappedStakeholderForm from '../shared/MappedStakeholderForm'

const MappedStakeholderCreatePage = props => {
  const [initialFormValues, setInitialFormValues] = useState(null)

  useEffect(() => {
    const fetchInitialData = async () => {
      const mergedStakeholder = await props.mergedStakeholderFindOne(props.stakeholderMapId, props.stakeholderId)

      if (mergedStakeholder === null) {
        props.showMessage(MESSAGES.CONTENT.ERROR, MESSAGES.TYPES.ERROR)
        return
      }

      setInitialFormValues(mergedStakeholder)
    }

    fetchInitialData()
  }, [])

  const navigateToMappedStakeholderView = () => {
    props.history.push(compilePath(PAGES.MAPPED_STAKEHOLDER_VIEW.PATH, { stakeholderMapId: props.stakeholderMapId, stakeholderId: props.stakeholderId }))
  }

  const handleSubmit = (values, props) => {
    const applyChanges = async () => {
      const stakeholder = await props.stakeholderUpdate(values, { where: { id: props.stakeholderId } })
      const mappedStakeholder = await props.mappedStakeholderUpdate(values, { where: { stakeholderId: props.stakeholderId, stakeholderMapId: props.stakeholderMapId } })

      if (stakeholder === null || mappedStakeholder === null) {
        return false
      }

      return true
    }

    applyChanges().then(success => {
      if (success) {
        props.showMessage(MESSAGES.CONTENT.SUCCESS, MESSAGES.TYPES.SUCCESS)
      } else {
        props.showMessage(MESSAGES.CONTENT.ERROR, MESSAGES.TYPES.ERROR)
      }

      navigateToMappedStakeholderView()
    })
  }

  if (initialFormValues === null) {
    return null
  }

  return (
    <Grid
      container
      spacing={3}
    >
      <Grid
        item
        xs={12}
        md={8}
      >
        <MappedStakeholderForm
          initialValues={initialFormValues}
          onCancel={navigateToMappedStakeholderView}
          onSubmit={values => handleSubmit(values, props)}
        />
      </Grid>
    </Grid>
  )
}

MappedStakeholderCreatePage.propTypes = {
  stakeholderId: PropTypes.string.isRequired,
  stakeholderMapId: PropTypes.string.isRequired
}

let Page = MappedStakeholderCreatePage

Page = withLayout(Page)
Page = withMappedStakeholders(Page)
Page = withStakeholders(Page)
Page = withStakeholderMaps(Page)

export default Page
