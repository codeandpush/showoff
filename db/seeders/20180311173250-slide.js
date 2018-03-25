'use strict';
const _ = require('lodash')
const moment = require('moment')

const items = [
    {
        title: 'Slide 1',
        html: '<h1>Hello Slide 1</h1>'
    },
    {
        title: 'Slide 1',
        html: `<h1>Hello Slide 2</h1>`
    },
]

module.exports = {
  up: function (queryInterface, Sequelize) {
      let prods = _(items)
          .map((value) => _.extend(value, {createdAt: new Date(), updatedAt: new Date()}))
          .value()
      
      return queryInterface.bulkInsert('Slides', prods, {})
  },
  down: function (queryInterface, Sequelize) {
      return queryInterface.bulkDelete('Slides', null, {})
  }
};
