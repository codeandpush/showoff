/**
 * Created by anthony on 01/04/2018.
 */
const bz = require('bkendz')
const path = require('path')
const _ = require('lodash')
const utils = require('./lib/utils')

const admin = new bz.AdministerSession({viewPath: path.resolve(__dirname, './admin_views')})

admin.onApiLocation = function(req){
    let hostname = (req.msg.data || {}).hostname
    return utils.getApiLocation(hostname)
}

admin.messageHandlers.http.get('/', (req, res) => {
    let tabs = []
    let schema = bz.db.schema()
    const models = require('./models')
    _.each(schema, function (def, clsName) {
        if(models[clsName].isJunction()) return
        tabs.push({label: clsName, content: `Hello ${clsName}`})
    })
    
    res.render('index', {tabs, defaultTab: 'user', schemaJson: JSON.stringify(schema, null, 4)})
})

module.exports = {default: admin}