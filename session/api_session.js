/**
 * Created by anthony on 26/03/2018.
 */
const {ApiSessionHandler} = require('bkendz')
const url = require('url')

class ShowoffApiSession extends ApiSessionHandler {
    
    onMessage(messageHandler, request, conn){
        console.log('API recieved...', request)
        let parsed = url.parse(request.topic, true)
        switch (parsed.pathname){
            case '/slides':
                this.models.Presentation.findById(parsed.query.presentationid)
                    .then(p => p.getSlides())
                    .then((slides) => {
                        request.data = slides.map((s) => s.toJson())
                        messageHandler.respond(conn, request)
                    })
                break
            default:
                messageHandler.respond(conn, request)
        }
    }
    
}

module.exports = ShowoffApiSession