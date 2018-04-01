/**
 * Created by anthony on 01/04/2018.
 */
const _ = require('lodash')

function getApiLocation(hostname) {
    
    if (hostname === 'localhost') {
        return {
            http: 'http://localhost:9001',
            ws: 'ws://localhost:9001',
        }
    } else {
        let location = {}
        let hostname = '//showoff-api.herokuapp.com'
        _.each(['ws', 'wss', 'http', 'https'], (protocol) => {
            location[protocol] = `${protocol}:${hostname}`
        })
        return location
    }
}

module.exports = {getApiLocation}