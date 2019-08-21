import Sequelize from 'sequelize'

const setAssociations = models => {
  const { mappedStakeholder, stakeholder, stakeholderMap } = models

  stakeholder.belongsToMany(stakeholderMap, { through: mappedStakeholder })
}

const schema = {
  firstName: {
    type: Sequelize.STRING
  },
  organisation: {
    type: Sequelize.STRING
  },
  position: {
    type: Sequelize.STRING
  },
  sector: {
    type: Sequelize.STRING
  },
  surname: {
    type: Sequelize.STRING
  }
}

export default {
  schema,
  setAssociations
}
