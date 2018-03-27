/**
 * Created by anthony on 26/03/2018.
 */
const {SessionHandler} = require('bkendz')

class ShowoffSession extends SessionHandler {

    onMessage(messageHandler, request, conn){
        console.log('Client recieved...')
        messageHandler.respond(conn, request)
    }

}

module.exports = ShowoffSession