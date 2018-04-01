/**
 * Created by anthony on 18/03/2018.
 */
const bz = require('bkendz')
const _ = require('lodash')
const clientSession = require('./client_session')
const apiSession = require('./api_session')
const adminSession = require('./admin_session')

const app = new bz.Bkendz({
    enableOnly: process.env.BZ_PROCESS_NAME || bz.Bkendz.PROCESS_NAME_CLIENT,
    standalone: _.isUndefined(process.env.STANDALONE) ? true : process.env.STANDALONE.toLowerCase() !== 'false'
})

app.api = apiSession.default
app.client = clientSession.default
app.admin = adminSession.default

const port = process.env.PORT || 9001
console.log(`starting monitoring server on ${port}...`)
app.listen(port)