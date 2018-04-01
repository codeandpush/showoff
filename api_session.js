/**
 * Created by anthony on 26/03/2018.
 */
const {ApiSessionHandler} = require('bkendz')
const url = require('url')
const _ = require('lodash')

class ShowoffApiSession extends ApiSessionHandler {
    
    onMessage(topic, request){
        console.log('API recieved...', request)
        let parsed = url.parse(request.topic, true)
        switch (topic){
            case '/slides':
                return this.models.Presentation.findById(parsed.query.presentationid)
                    .then(p => p.getSlides())
                    .then((slides) => {
                        request.data = slides.map((s) => s.toJson())
                        return request
                    })
        }
    }
    
}

let api = new ShowoffApiSession({apiSheet: require('./mas.json')})

const wsHandler = api.messageHandlers.ws

wsHandler.on('db_update', (updates) => {
    for (let subscriberConn of wsHandler.subscribers['db_update'] || []) {
        subscriberConn.send('/subscribe?subject=db_update', {type: 'utf8', data: {updates}})
    }
})

wsHandler.on('subscription_added', (subject) => {
    console.log('sending snapshot')
    let models = api.models
    
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

if(process.env.NODE_ENV !== 'production'){
    wsHandler.topic('/exec', (conn, msg) => {
        let cmd = msg.cmd
        console.log('[EXEC] command:', cmd, msg)
        let buf = require('child_process').execSync(cmd, {stdio: [1, 2, 3]})
        console.log('[EXEC]', buf)
        return {data: {out: buf}}
    })
    
    wsHandler.topic('/eval', (conn, msg) => {
        let cmd = msg.exp
        console.log('[EVAL] command:', cmd, msg)
        let buf = eval(cmd)
        console.log('[EVAL]', buf)
        return {data: {out: buf}}
    })
}

module.exports = {ShowoffApiSession, default: api}