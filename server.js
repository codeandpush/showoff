/**
 * Created by anthony on 18/03/2018.
 */
const bz = require('bkendz')
const models = require('./models')

const app = new bz.Bkendz({models})

const port = process.env.PORT || 9000
console.log(`starting monitoring server on ${port}...`)
app.adminServer.listen(9000)

class SoSessionHandler extends bz.SessionHandler {

}

const session = new SoSessionHandler()

session.on('preference_changed', (messageHandler, prefName, ) => {

})