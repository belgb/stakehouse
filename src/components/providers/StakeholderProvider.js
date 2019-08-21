import React from 'react'
import { MODELS } from '../../constants'
import { clients } from '../../db/clients'

const withStakeholders = WrappedComponent => {
  const db = clients[MODELS.STAKEHOLDER]

  const stakeholderDestroy = id => {
    return db.destroy(id)
  }

  const stakeholderFindAll = query => {
    return db.findAll(query)
  }

  const stakeholderFindOne = query => {
    return db.findOne(query)
  }

  const stakeholderCreate = item => {
    return db.create(item)
  }

  const stakeholderUpdate = (item, query) => {
    return db.update(item, query)
  }

  const StakeholderProvider = props => (
    <WrappedComponent
      {...props}
      stakeholderDestroy={stakeholderDestroy}
      stakeholderFindAll={stakeholderFindAll}
      stakeholderFindOne={stakeholderFindOne}
      stakeholderCreate={stakeholderCreate}
      stakeholderUpdate={stakeholderUpdate}
    />
  )

  return StakeholderProvider
}

export default withStakeholders
