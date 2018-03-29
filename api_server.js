/**
 * Created by anthony on 29/03/2018.
 */
const bz = require('bkendz')
const models = require('./models')
const _ = require('lodash')
const path = require('path')
const ShowoffSession = require('./session/client_session')
const ShowoffApiSession = require('./session/api_session')

bz.Bkendz.SESSION_CLS_CLIENT = ShowoffSession
bz.Bkendz.SESSION_CLS_API = ShowoffApiSession

const app = new bz.Bkendz({
    apiSheet: require('./mas.json'),
    enableOnly: bz.Bkendz.PROCESS_NAME_API,
    standalone: _.isUndefined(process.env.STANDALONE) ? true : process.env.STANDALONE.toLowerCase() !== 'false',
    optsClient: {staticPath: path.resolve(__dirname, './src')}
})

const wsHandler = app.api.messageHandlers.ws

wsHandler.on('db_update', (updates) => {
    for (let subscriberConn of wsHandler.subscribers['db_update'] || []) {
        subscriberConn.send('/subscribe?subject=db_update', {type: 'utf8', data: {updates}})
    }
})

wsHandler.on('subscription_added', (subject) => {
    console.log('sending snapshot')
    let models = require('./models').sequelize.models
    
    _.each(models, (cls, modelName) => {
        cls.all().then((records) => {
            let updates = records.map(u => {
                return {changeType: 'NEW', type: modelName, value: u.toJson()}
            })
            wsHandler.emit('db_update', updates)
        })
    })
})

wsHandler.topic('/status', () => {
    return {data: {clients: wsHandler.connections.length}}
})

const port = process.env.PORT || 9001
console.log(`starting monitoring server on ${port}...`)
app.listen(port)