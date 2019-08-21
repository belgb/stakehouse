import React from 'react'
import { MODELS, COMMS_GROUPS, COMMS_KEYS, COMMS_RESPONSES } from '../../constants'
import { clients } from '../../db/clients'

const getCommsKey = (influence, interest) => {
  let key = ''

  if (interest > 5 && influence > 5) {
    key = COMMS_KEYS['MANAGE']
  } else if (interest < 6 && influence > 5) {
    key = COMMS_KEYS['SATISFIED']
  } else if (interest > 5 && influence < 6) {
    key = COMMS_KEYS['INFORMED']
  } else if (interest < 6 && influence < 6) {
    key = COMMS_KEYS['MONITOR']
  }

  return key
}

const withMappedStakeholders = WrappedComponent => {
  const db = clients[MODELS.MAPPED_STAKEHOLDER]

  const mappedStakeholderDestroy = id => {
    return db.destroy(id)
  }

  const mappedStakeholderFindAll = query => {
    return db.findAll(query)
  }

  const mappedStakeholderFindOne = query => {
    return db.findOne(query)
  }

  const mappedStakeholderCreate = item => {
    return db.create(item)
  }

  const mappedStakeholderUpdate = (item, query) => {
    return db.update(item, query)
  }

  const mappedStakeholderCommsGroup = (influence, interest) => {
    return COMMS_GROUPS[getCommsKey(influence, interest)]
  }

  const mappedStakeholderCommsResponse = (influence, interest) => {
    return COMMS_RESPONSES[getCommsKey(influence, interest)]
  }

  const MappedStakeholderProvider = props => (
    <WrappedComponent
      {...props}
      mappedStakeholderDestroy={mappedStakeholderDestroy}
      mappedStakeholderFindAll={mappedStakeholderFindAll}
      mappedStakeholderFindOne={mappedStakeholderFindOne}
      mappedStakeholderCreate={mappedStakeholderCreate}
      mappedStakeholderUpdate={mappedStakeholderUpdate}
      mappedStakeholderCommsGroup={mappedStakeholderCommsGroup}
      mappedStakeholderCommsResponse={mappedStakeholderCommsResponse}
    />
  )

  return MappedStakeholderProvider
}

export default withMappedStakeholders
