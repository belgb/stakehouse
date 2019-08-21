import Sequelize from 'sequelize'

const schema = {
  interest: {
    type: Sequelize.INTEGER,
    validate: {
      min: 1,
      max: 10
    }
  },
  influence: {
    type: Sequelize.INTEGER,
    validate: {
      min: 1,
      max: 10
    }
  },
  relationshipOwner: {
    type: Sequelize.STRING
  },
  relationshipStatus: {
    type: Sequelize.STRING
  }
}

export default {
  schema
}
