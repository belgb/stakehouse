import React from 'react'
import { MODELS } from '../../constants'
import { clients } from '../../db/clients'

const withStakeholderMaps = WrappedComponent => {
  const stakeholderMapDbClient = clients[MODELS.STAKEHOLDER_MAP]
  const stakeholderDbClient = clients[MODELS.STAKEHOLDER]
  const mappedStakeholderDbClient = clients[MODELS.MAPPED_STAKEHOLDER]

  const stakeholderMapDestroy = id => {
    return stakeholderMapDbClient.destroy(id)
  }

  const stakeholderMapFindAll = query => {
    return stakeholderMapDbClient.findAll(query)
  }

  const stakeholderMapFindOne = query => {
    return stakeholderMapDbClient.findOne(query)
  }

  const stakeholderMapCreate = item => {
    return stakeholderMapDbClient.create(item)
  }

  const stakeholderMapUpdate = (item, query) => {
    return stakeholderMapDbClient.update(item, query)
  }

  /**
   * @param {String} stakeholderMapId
   *
   * @return {Array|null}
   */
  const mergedStakeholderFindAll = async stakeholderMapId => {
    const mappedStakeholder = await mappedStakeholderDbClient.findAll({ where: { stakeholderMapId } })
    const stakeholders = await stakeholderDbClient.findAll()

    if (mappedStakeholder === null || stakeholders === null) {
      return null
    }

    return mappedStakeholder.reduce((result, item) => {
      const stakeholder = stakeholders.find(s => s.id === item.stakeholderId)

      if (stakeholder === undefined) {
        return result
      }

      delete item.stakeholderId

      result.push({ ...item, ...stakeholder })

      return result
    }, [])
  }

  /**
   * @param {String} stakeholderMapId
   * @param {String} stakeholderId
   *
   * @return {Object|null}
   */
  const mergedStakeholderFindOne = async (stakeholderMapId, stakeholderId) => {
    const mappedStakeholder = await mappedStakeholderDbClient.findOne({ where: { stakeholderId, stakeholderMapId } })
    const stakeholder = await stakeholderDbClient.findOne({ where: { id: stakeholderId } })

    if (mappedStakeholder === null || stakeholder === null) {
      return null
    }

    delete mappedStakeholder.stakeholderId

    const mergedStakeholder = { ...stakeholder, ...mappedStakeholder }

    delete mergedStakeholder.createdAt
    delete mergedStakeholder.updatedAt

    return mergedStakeholder
  }

  const StakeholderMapProvider = props => (
    <WrappedComponent
      {...props}
      stakeholderMapDestroy={stakeholderMapDestroy}
      stakeholderMapFindAll={stakeholderMapFindAll}
      stakeholderMapFindOne={stakeholderMapFindOne}
      stakeholderMapCreate={stakeholderMapCreate}
      stakeholderMapUpdate={stakeholderMapUpdate}
      mergedStakeholderFindAll={mergedStakeholderFindAll}
      mergedStakeholderFindOne={mergedStakeholderFindOne}
    />
  )

  return StakeholderMapProvider
}

export default withStakeholderMaps
