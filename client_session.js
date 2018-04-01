/**
 * Created by anthony on 26/03/2018.
 */
const {SessionHandler} = require('bkendz')
const _ = require('lodash')
const path = require('path')
const utils = require('./lib/utils')

class ShowoffSession extends SessionHandler {

    onMessage(topic, request){
        console.log('Client recieved...', request)
    }
    
    onApiLocation(req){
        let hostname = (req.msg.data || {}).hostname
        return utils.getApiLocation(hostname)
    }

}

const client = new ShowoffSession({staticPath: path.resolve(__dirname, './src')})

client.messageHandlers.http.set('views', path.resolve(__dirname, './views'))

client.messageHandlers.http.get('/', (req, res) => {
    res.render('index')//, {elemName: 'TEST!!!'})
})

client.messageHandlers.http.get('/slides/:id', (req, res) => {
    let slideId = _.toInteger(req.params.id)
    
    res.render('edit_slide', {slide: {title: `Test ${slideId}`}})
})

module.exports = {ShowoffSession, default: client}