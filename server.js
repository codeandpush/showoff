/**
 * Created by anthony on 18/03/2018.
 */
const bz = require('bkendz')
const models = require('./models')
const _ = require('lodash')
const app = new bz.Bkendz({models})

const port = process.env.PORT || 9001
console.log(`starting monitoring server on ${port}...`)
app.listen(port)

app.administerEnabled = true
app.clientEnabled = true

const libDb = require('./lib/db')

app.admin.on('request', (messageHandler, request, conn) => {
    console.log('REQ:', request)
    
    if(request.topic.startsWith('/db_schema')){
        request = {
            data: libDb.schema(),
            topic: request.topic,
            type: 'utf8'
        }
    }
    
    messageHandler.respond(conn, request)
})

app.api.create(models.User, (messageHandler, request) => {
})

app.api.service('/authenticate', (messageHandler, request) => {

})

app.adminWs.handler.on('db_update', (updates) => {
    for(let subscriberConn of app.adminWs.handler.subscribers['db_update'] || []){
        subscriberConn.send('/subscribe?subject=db_update', {type: 'utf8', data:{updates}})
    }
})

app.adminWs.handler.on('subscription_added', (subject) => {
        console.log('sending snapshot')
        let models = require('./models').sequelize.models
        let wsHandler = app.adminWs.handler
    
        _.each(models, (cls, modelName) => {
            cls.all().then((records) => {
                let updates = records.map(u => {
                    return {changeType: 'NEW', type: modelName, value: u.toJson()}
                })
                wsHandler.emit('db_update', updates)
            })
        })
})
