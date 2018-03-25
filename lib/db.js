/**
 * Created by anthony on 24/03/2018.
 */
const models = require('../models')
const _ = require('lodash')

function schema() {
    let modelDefs = {}
    _.each(models.sequelize.models, (modelCls) => {
        let colDefs = modelCls.columnDefs(models.sequelize.Sequelize.DataTypes)
        let defs = modelDefs[modelCls.name] = {createdAt: 'DATE', updatedAt: 'DATE'}
        
        for(let [colName, info] of _.toPairs(colDefs)){
            defs[colName] = info.key
        }
    })
    return modelDefs
}

module.exports = {schema}