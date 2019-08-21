import log from 'electron-log'
import promiseIpc from 'electron-promise-ipc'
import Sequelize from 'sequelize'
import definitions from './models'
import { client } from './clients'

const db = {
  /**
   * Establishes a database connection.
   *
   * @param {String} dialect
   * @param {String} storage
   *
   * @return {Promise}
   */
  init: (dialect, storage) => {
    return new Promise((resolve, reject) => {
      const sequelize = new Sequelize('database', null, null, { dialect, storage })

      return sequelize
        .authenticate()
        .then(() => {
          return new Promise((resolve, reject) => {
            // Create Sequelize model instances from custom definitions.
            const models = Object.keys(definitions).reduce((acc, key) => {
              const { schema, getterMethods, setterMethods } = definitions[key]
              acc[key] = sequelize.define(key, schema, { getterMethods, setterMethods })
              return acc
            }, {})

            Object.keys(definitions).forEach(definitionName => {
              const definition = definitions[definitionName]

              // Create model associations.
              if (definition.setAssociations) {
                definition.setAssociations(models)
              }

              // Apply hooks, providing access to models.
              if (definition.hooks) {
                Object.keys(definition.hooks).forEach((hookName) => {
                  const model = models[definitionName]

                  model.hook(hookName, (instance, options) => {
                    return definition.hooks[hookName](instance, options, models)
                  })
                })
              }
            })

            // Sync model data with database tables.
            return sequelize
              .sync()
              .then(() => {
                resolve(models)
              })
              .catch((error) => {
                reject(error)
              })
          })
        })
        .then((models) => {
          promiseIpc.on('database', message => {
            const m = JSON.parse(message)
            return client[m.methodName](models[m.modelName], ...m.args)
          })

          resolve()
        })
        .catch(error => {
          log.error('Unable to initialise database')
          reject(error)
        })
    })
  }
}

export default db
