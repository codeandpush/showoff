/**
 * Created by anthony on 26/03/2018.
 */
class Deferred {
    
    constructor() {
        this.id = `${this.constructor._ID++}`
        
        this.promise = new Promise((res, rej) => {
            this.resolve = res
            this.reject = rej
        })
    }
    
    cancel() {
        this.reject('Cancelled!')
    }
    
    then(...args) {
        this._promise = (this._promise || this.promise).then(...args)
        return this
    }
}

Deferred._ID = 1

class ShowoffApp extends EventEmitter3 {
    
    constructor() {
        super()
        this.retryCount = {api: 0, server: 0}
        this.deferreds = {}
        this._presentations = []
        this._selectedPresentation = this._activeSlide = null
        this.apiLocation = null
    }
    
    get elems() {
        return {
            connectionAlert: $('#connection_alert')
        }
    }
    
    connect(url, options = {}) {
        let ws = new WebSocket(url, 'echo-protocol')
        this.retryCount[options.retryCount]++
        
        _.merge(WebSocket.prototype, Object.create(EventEmitter3.prototype))
        EventEmitter3.call(ws)
        
        let name = options.retryCount
        
        let subscriptions = ws.subscriptons = {}
        
        ws.on = function (eventName, callback) {
            let topic = `/${eventName}`
            console.log(`${name}: event=${eventName}, topic=${topic}`)
            
            let subscribe = `/subscribe?subject=${eventName}`
            ws.json(subscribe)
                .then((resp) => {
                    subscriptions[resp.data.subscribed] = 0
                    console.log('subscriptions:', subscriptions)
                    
                    EventEmitter3.prototype.on.call(ws, eventName, callback)
                })
        }
        
        ws.onopen = () => {
            this.retryCount[options.retryCount] = 0
            this.emit(options.connected || 'server_connected')
        }
        
        ws.onclose = () => {
            this.emit(options.disconnected || 'server_disconnected')
        }
        
        ws.onerror = (err) => {
            console.error(err)
        }
        
        ws.json = (topic, data) => {
            let deferred = new Deferred()
            this.deferreds[deferred.id] = deferred
            
            let req = {topic: `${topic}${_.includes(topic, '?') ? '&' : '?'}uid=${deferred.id}`, data: data}
            ws.send(JSON.stringify(req))
            return deferred
        }
        
        ws.onmessage = (message) => {
            let msg = JSON.parse(message.data)
            let parts = _.split(msg.topic, '?', 2)
            
            let parsed = _.chain(_.last(parts))
                .replace('?', '') // a=b454&c=dhjjh&f=g6hksdfjlksd
                .split('&') // ["a=b454","c=dhjjh","f=g6hksdfjlksd"]
                .map(_.partial(_.split, _, '=', 2)) // [["a","b454"],["c","dhjjh"],["f","g6hksdfjlksd"]]
                .fromPairs() // {"a":"b454","c":"dhjjh","f":"g6hksdfjlksd"}
                .value()
            
            let deferredId = parsed.uid
            let deferred = this.deferreds[deferredId]
            let topic = _.first(parts)
            
            if (_.isObject(deferred)) {
                delete this.deferreds[deferredId]
                deferred.resolve(msg)
            } else if (topic === '/subscribe' && parsed.subject in subscriptions) {
                subscriptions[parsed.subject]++
                ws.emit(parsed.subject, msg)
            } else {
                console.error('no pending promise', message, topic, parsed)
            }
        }
        
        return ws
    }
    
    connectToServer() {
        let url = `${location.protocol === 'https:' ? 'wss://' : 'ws://'}${location.host}`
        this.server = this.connect(url, {
            connected: 'server_connected',
            disconnected: 'server_disconnected',
            retryCount: 'server'
        })
    }
    
    connectToApi() {
        if(!this.apiLocation) throw Error('No API location provided!')
        let url = this.apiLocation[location.protocol === 'http:' ? 'ws' : 'wss']
        this.api = this.connect(url, {connected: 'api_connected', disconnected: 'api_disconnected', retryCount: 'api'})
    }
    
    addPresentations(presentations) {
        let pres = []
        for (let p of presentations) {
            let ext = _.find(this.presentations, {id: p.id})
            
            if (ext) {
                pres.push(_.merge(ext, p))
            } else {
                pres.push(p)
            }
        }
        this.presentations = pres
    }
    
    set presentations(presentations) {
        this._presentations = presentations
        this.emit('added_presentations', this._presentations)
    }
    
    get presentations() {
        return this._presentations
    }
    
    set selectedPresentation(pres) {
        this._selectedPresentation = pres
        this.emit('selected_presentation', this._selectedPresentation)
    }
    
    set activeSlide(slide) {
        let old = this._activeSlide
        this._activeSlide = slide
        this.emit('active_slide', this._activeSlide, old)
    }
    
    get activeSlide() {
        return this._activeSlide
    }
    
    get selectedPresentation() {
        return this._selectedPresentation
    }
    
    get slidesElem() {
        return $(document.querySelector('#slides_container'))
    }
    
    init() {
        const emitWrap = (event) => {
            let emit = event.target.getAttribute(`data-emit-${event.type}`)
            this.emit(`${event.type}_${emit}`, event)
        }
        
        ['keyup', 'click'].forEach((eventType) => {
            $(document).on(eventType, `[data-emit-${eventType}]`, emitWrap)
        })
    }
}

window.app = new ShowoffApp()

app.on('server_disconnected', () => {
    console.log('server disconnected')
    app.elems.connectionAlert.show().slideDown()
    setTimeout(() => app.connectToServer(), 1000 * app.retryCount.server)
})

app.on('server_connected', () => {
    console.log('server connected')
    app.elems.connectionAlert.slideUp().hide()
    
    if(!app.apiLocation){
        app.server.json('/api', location).then((res) => {
            app.apiLocation = res.data
            app.connectToApi()
        })
    }
})

app.on('api_disconnected', () => {
    console.log('api disconnected')
    setTimeout(() => app.connectToApi(), 1000 * app.retryCount.api)
})

app.on('api_connected', () => {
    console.log('api connected')
    
    if(!document.querySelector('#slides_container')) return
    
    app.api.on('db_update', (snapshot) => {
        let presentations = _.chain(snapshot.data.updates).map((update) => {
            let value = update.value
            if (value.type !== 'Presentation') return null
            return value
        }).compact().value()
        
        if (_.isEmpty(presentations)) return
        app.addPresentations(presentations)
    })
})

app.on('selected_presentation', (p) => {
    
    app.api.json(`/slides?presentationid=${p.id}`)
        .then((res) => {
            p.slides = res.data
            app.activeSlide = _.first(res.data)
        })
})

app.on('click_presentation', (e) => {
    let presId = $(e.target).attr('data-presentationid')
    let pres = _.find(app.presentations, {id: _.toInteger(presId)})
    
    if (!pres) return
    app.selectedPresentation = pres
})

app.on('active_slide', (slide, oldSlide) => {
    if(!_.isObject(slide)) return
    
    app.slidesElem.empty()
    
    let page = $(slide.html)
    app.slidesElem.append(page)
    
    app.slidesElem.show()
})

app.on('close_presentation', () => {
    app.slidesElem.hide()
})

app.on('click_close_presentation', () => app.emit('close_presentation'))

app.on('transition_slide', (fwd) => {
    let currentSide = app.activeSlide
    if(!currentSide) return
    
    let slides = app.selectedPresentation.slides
    let curIdx = _.findIndex(slides, {id: currentSide.id})
    
    if (curIdx < 0) return
    if (fwd && ((curIdx + 1) >= slides.length)) return
    if (!fwd && (curIdx === 0)) return
    
    app.activeSlide = fwd ? slides[curIdx + 1] : slides[curIdx - 1]
})

app.on('click_next_slide', (e) => app.emit('transition_slide', true))
app.on('click_previous_slide', (e) => app.emit('transition_slide', false))

app.on('keyup_stage', (e) => {
    switch (e.which) {
        case 39:
            app.emit('transition_slide', true)
            break
        case 37:
            app.emit('transition_slide', false)
            break
        case 27:
            app.emit('close_presentation')
            break
    }
})

app.on('added_presentations', (presentations) => {
    let elem = $('#presentations')
    elem.empty()
    
    let tmp = `
<div class="col-md-4">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title"><a data-emit-click="presentation" data-presentationid="<%= id %>"><%= title %></a></h3>
      </div>
      <div class="panel-body">
        <%= description %>
      </div>
    </div>
</div>
`
    
    let compiled = _.template(tmp)
    for (let pres of presentations) {
        let i = $(compiled(pres))
        elem.append(i)
    }
})

document.addEventListener('DOMContentLoaded', function () {
    // lookup the container we want the Grid to use
    console.log('DOM loaded')
    app.init()
    
    app.connectToServer()
    
})