/**
 * Created by anthony on 26/03/2018.
 */
const {ApiSessionHandler} = require('bkendz')

class ShowoffApiSession extends ApiSessionHandler {
    
    onMessage(messageHandler, request, conn){
        console.log('API recieved...', request)
        messageHandler.respond(conn, request)
    }
    
}

module.exports = ShowoffApiSession