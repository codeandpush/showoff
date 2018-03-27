/**
 * Created by anthony on 18/03/2018.
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
    enableOnly: bz.Bkendz.PROCESS_NAME_ADMIN,
    standalone: true,
    optsClient: {staticPath: path.resolve(__dirname, './src')}
})

app.admin.messageHandlers.http.set('views', path.resolve(__dirname, './admin_views'))

app.admin.messageHandlers.http.get('/', (req, res) => {
    let tabs = []
    let schema = bz.db.schema()
    _.each(schema, function (def, clsName) {
        if(models[clsName].isJunction()) return
        tabs.push({label: clsName, content: `Hello ${clsName}`})
    })
    
    res.render('index', {tabs, defaultTab: 'user', schemaJson: JSON.stringify(schema, null, 4)})
})

app.api.on('message', (messageHandler, request, conn) => messageHandler.respond(conn, request))

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