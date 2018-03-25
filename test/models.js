/**
 * Created by anthony on 24/03/2018.
 */
const assert = require('assert')
const Promise = require('bluebird')
const models = require('../models')
const _ = require('lodash')

describe('Models', function () {
    
    beforeEach(function () {
        return models.sequelize.sync({force: true})
            .then(() => {
                return models.User.create({email: 'test@test.com', name: 'Test Tester'})
            })
            .then((user) => {
                let pres = models.Presentation.create({createdById: user.id, title: 'Test Presentation',})
                
                let slides = [models.Slide.create({title: 'Presentation 1', html: 'Hello World 1'}),
                    models.Slide.create({title: 'Presentation 2', html: 'Hello World 2'})]
                return Promise.all(_.concat([pres], slides))
            })
            .then(() => {
                return Promise.all([
                    models.PresentationSlide.create({slideId: 1, presentationId: 1}),
                    models.PresentationSlide.create({slideId: 2, presentationId: 1})
                ])
            })
    })
    
    describe('Presentation', function () {
        it('#getCreatedBy()', function () {
            return models.Presentation.findById(1)
                .then(p => p.getCreatedBy())
                .then((createdBy) => {
                    assert.deepStrictEqual(createdBy.email, 'test@test.com')
                })
        })
        
        it('#getSlides()', function () {
            return models.Presentation.findById(1)
                .then((p) => p.getSlides())
                .then((slides) => {
                    assert.strictEqual(slides.length, 2)
                })
        })
    })
    
    describe('Slide', function () {
        it('#getPresentations()', function () {
            return models.Slide.findById(1)
                .then(s => s.getPresentations())
                .then((presentations) => {
                    assert.strictEqual(presentations.length, 1)
                    let [pres] = presentations
                    assert.deepStrictEqual(pres.title, 'Test Presentation')
                })
        })
        
    })
    
    describe('PresentationSlide', function () {
        it('#getSlide()', function () {
            return models.PresentationSlide.findById(1)
                .then(s => s.getSlide())
                .then((slide) => {
                    assert.deepStrictEqual(slide.title, 'Presentation 1')
                })
        })
        
    })
})