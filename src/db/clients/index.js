import log from 'electron-log'
import promiseIpc from 'electron-promise-ipc'
import models from '../models'

export const client = {
  /**
   * Adds a record to the database.
   *
   * @param {Object} model
   * @param {Object} dataValues
   *
   * @return {Object|null}
   */
  create: async (model, dataValues) => {
    try {
      const record = await model.create(dataValues)
      return record.get({ plain: true })
    } catch (error) {
      log.error(error)
    }

    return null
  },

  /**
   * Delete one or more records.
   *
   * @param {Object} query
   *
   * @return {Number} The number of rows destroyed.
   */
  destroy: async (model, query) => {
    try {
      return await model.destroy(query)
    } catch (error) {
      log.error(error)
    }

    return null
  },

  /**
   * Finds all records matching the provided query.
   *
   * @param {Object} model
   * @param {Object} query
   *
   * @return {Array<Object>|null}
   */
  findAll: async (model, query) => {
    const q = query || {}
    let records = null

    try {
      records = await model.findAll(q)
      records = records.map(record => record.get({ plain: true }))
    } catch (error) {
      log.error(error)
    }

    return records
  },

  /**
   * Finds the first record matching the query.
   *
   * @param {Object} model
   * @param {Object} query
   *
   * @return {Object|null}
   */
  findOne: async (model, query) => {
    const record = await model.findOne(query)

    if (record === null) {
      return record
    }

    return record.get({ plain: true })
  },

  /**
   * Finds or creates a record.
   *
   * @param {Object} model
   * @param {Object} query
   *
   * @return {Object|null}
   */
  findOrCreate: async (model, query) => {
    try {
      const result = await model.findOrCreate(query)
      return result[0].get({ plain: true })
    } catch (error) {
      log.error(error)
    }

    return null
  },

  /**
   * Updates an existing trade in the database.
   *
   * @param {Object} model
   * @param {Object} values
   * @param {Object} query
   *
   * @return {Array<Number,Number>|null} Affected count and affected rows
   */
  update: async (model, values, query) => {
    try {
      return await model.update(values, query)
    } catch (error) {
      log.error(error)
    }

    return null
  },

  /**
   * Updates or inserts an item.
   *
   * @param {Object} model
   * @param {Object} dataValues
   *
   * @return {Boolean|null} Returns true if the item was created.
   */
  upsert: async (model, dataValues) => {
    try {
      return await model.upsert(dataValues)
    } catch (error) {
      log.error(error)
    }
  }
}

const clientProxyFactory = modelName => {
  return Object.keys(client).reduce((clientProxy, methodName) => {
    clientProxy[methodName] = (...args) => {
      return promiseIpc.send('database', JSON.stringify({ modelName, methodName, args }))
    }
    return clientProxy
  }, {})
}

export const clients = Object.keys(models).reduce((clientProxy, modelName) => {
  clientProxy[modelName] = clientProxyFactory(modelName)
  return clientProxy
}, {})
