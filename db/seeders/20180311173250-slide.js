'use strict';
const _ = require('lodash')
const moment = require('moment')

module.exports = {
  up: function (queryInterface, Sequelize) {
      const templateStr = `
            <div class="container" style="margin-top: 16%">
                <div class="row">
                    <div class="col-md-8 col-md-offset-4"><h3><%= slide.title %></h3></div>
                </div>
                <div class="row">
                    <div class="col-md-8 col-md-offset-4">
                        <div style="height: calc(100% - 32px);width: 100%"><%= slide.html %></div>
                    </div>
                </div>
            </div>
            `
      const render = _.template(templateStr)
      
      let prods = _(items)
          .map((value) => {
            let updates = {createdAt: new Date(), updatedAt: new Date()}
            updates.html = render({slide: value})
            return _.merge(value, updates)
          })
          .value()
      
      return queryInterface.bulkInsert('Slides', prods, {})
  },
  down: function (queryInterface, Sequelize) {
      return queryInterface.bulkDelete('Slides', null, {})
  }
}


const items = [
    {
        title: 'OutLine: Two-part Guide',
        html: `<h1>Hello Slide 1</h1>`
    },
    {
        title: 'Introducing Web Application Development',
        html: `<h1>Hello Slide 2</h1>`
    },
    {
        title: 'Lessons Learnt - Haminata',
        html: `<h1>Hello Slide 3</h1>`
    },
]
