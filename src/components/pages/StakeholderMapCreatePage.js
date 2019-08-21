import Grid from '@material-ui/core/Grid'
import React from 'react'
import { MESSAGES, PAGES } from '../../constants'
import { compilePath } from '../../util/path'
import withLayout from '../providers/LayoutProvider'
import withStakeholderMaps from '../providers/StakeholderMapsProvider'
import StakeholderMapForm from '../shared/StakeholderMapForm'

const StakeholderMapCreatePage = props => {
  const handleFormCancel = () => {
    props.history.push(PAGES.STAKEHOLDER_MAP_LIST.PATH)
  }

  const handleFormSubmit = values => {
    props
      .stakeholderMapCreate(values)
      .then(item => {
        if (item === null) {
          return props.showMessage(MESSAGES.CONTENT.ERROR, MESSAGES.TYPES.ERROR)
        }

        props.showMessage(MESSAGES.CONTENT.SUCCESS, MESSAGES.TYPES.SUCCESS)
        props.history.push(compilePath(PAGES.STAKEHOLDER_MAP_VIEW.PATH, { id: item.id }))
      })
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
          onCancel={handleFormCancel}
          onSubmit={handleFormSubmit}
        />
      </Grid>
    </Grid>
  )
}

let Page = StakeholderMapCreatePage

Page = withLayout(Page)
Page = withStakeholderMaps(Page)

export default Page
