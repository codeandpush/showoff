/**
 * Created by anthony on 18/03/2018.
 */
const bz = require('bkendz')
const models = require('./models')

const app = new bz.Bkendz({models})

const port = process.env.PORT || 9000
console.log(`starting monitoring server on ${port}...`)
app.listen(9000)

app.administerEnabled = true
app.clientEnabled = true

app.admin.on('', (request) => {
    request.respond({display: 'Hello World'})
})

app.admin.onPrefChanged('')

app.admin.on('request', (messageHandler, request, conn) => {
    console.log('REQ:', request)
    messageHandler.respond(conn, request)
})

app.api.create(models.User, (messageHandler, request) => {

})

app.api.update(models.User, (messageHandler, request) => {
    messageHandler.respond({display: 'Hello World'})
})

app.api.service('/authenticate', (messageHandler, request) => {

})

app.adminWs.messageHandler.on('subscription_added', subject => {
        console.log('sending snapshot')
        let models = require('./models')
        let wsHandler = app.adminWs.messageHandler

        models.User.all().then((users) => {
            let updates = users.map(u => {
                return {changeType: 'NEW', type: models.User.name, value: u.get({plain: true})}
            })
            wsHandler.emit('db_update', updates)
        })

        models.Presentation.all().then((items) => {
            let updates = items.map(u => {
                return {changeType: 'NEW', type: models.Presentation.name, value: u.get({plain: true})}
            })
            wsHandler.emit('db_update', updates)
        })
})
