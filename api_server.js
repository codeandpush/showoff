/**
 * Created by anthony on 29/03/2018.
 */
const bz = require('bkendz')
const _ = require('lodash')
const path = require('path')
const ShowoffSession = require('./session/client_session')
const ShowoffApiSession = require('./session/api_session')

bz.Bkendz.SESSION_CLS_CLIENT = ShowoffSession
bz.Bkendz.SESSION_CLS_API = ShowoffApiSession

console.log('[Showoff] starting env:', process.env.NODE_ENV)

const app = new bz.Bkendz({
    apiSheet: require('./mas.json'),
    enableOnly: bz.Bkendz.PROCESS_NAME_API,
    standalone: _.isUndefined(process.env.STANDALONE) ? true : process.env.STANDALONE.toLowerCase() !== 'false',
    optsClient: {staticPath: path.resolve(__dirname, './src')}
})

app.api._models = require('./models')
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

wsHandler.topic('/exec', (conn, msg) => {
    let cmd = msg.cmd
    console.log('[EXEC] command:', cmd, msg)
    let buf = require('child_process').execSync(cmd, {stdio: [1, 2, 3]})
    console.log('[EXEC]', buf)
    return {data: {out: buf}}
})

wsHandler.topic('/eval', (conn, msg) => {
    let cmd = msg.exp
    console.log('[EVAL] command:', cmd, msg)
    let buf = eval(cmd)
    console.log('[EVAL]', buf)
    return {data: {out: buf}}
})

const port = process.env.PORT || 9001

console.log(`starting monitoring server on ${port}...`)
app.listen(port)
