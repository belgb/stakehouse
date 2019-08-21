import Grid from '@material-ui/core/Grid'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { MESSAGES, PAGES } from '../../constants'
import { compilePath } from '../../util/path'
import withLayout from '../providers/LayoutProvider'
import withStakeholderMaps from '../providers/StakeholderMapsProvider'
import StakeholderMapForm from '../shared/StakeholderMapForm'

const StakeholderMapEditPage = props => {
  const [form, setForm] = useState(null)

  const handleFormCancel = () => {
    props.history.push(compilePath(PAGES.STAKEHOLDER_MAP_VIEW.PATH, { id: props.stakeholderMapId }))
  }

  const handleFormSubmit = values => {
    props
      .stakeholderMapUpdate(values, { where: { id: props.stakeholderMapId } })
      .then(affected => {
        if (!affected[0]) {
          props.showMessage(MESSAGES.CONTENT.ERROR, MESSAGES.TYPES.ERROR)
        } else {
          props.showMessage(MESSAGES.CONTENT.SUCCESS, MESSAGES.TYPES.SUCCESS)
        }

        props.history.push(compilePath(PAGES.STAKEHOLDER_MAP_VIEW.PATH, { id: props.stakeholderMapId }))
      })
  }

  useEffect(() => {
    props
      .stakeholderMapFindOne({ where: { id: props.stakeholderMapId } })
      .then(item => {
        if (item === null) {
          props.showMessage(MESSAGES.CONTENT.ERROR, MESSAGES.TYPES.ERROR)
          props.history.push(PAGES.STAKEHOLDER_MAP_LIST.PATH)
          return
        }

        setForm(item)
      })
  }, [])

  if (form === null) {
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
      >
        <StakeholderMapForm
          initialValues={form}
          onCancel={handleFormCancel}
          onSubmit={handleFormSubmit}
        />
      </Grid>
    </Grid>
  )
}

StakeholderMapEditPage.propTypes = {
  stakeholderMapId: PropTypes.string.isRequired
}

let Page = StakeholderMapEditPage

Page = withLayout(Page)
Page = withStakeholderMaps(Page)

export default Page
