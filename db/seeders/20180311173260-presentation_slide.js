'use strict';
const _ = require('lodash')
const moment = require('moment')

const items = [
    {
        slideId: 1,
        no: 1,
        presentationId: 1
    },
    {
        slideId: 2,
        no: 2,
        presentationId: 1
    },
    {
        slideId: 3,
        no: 2,
        presentationId: 2
    },
]

module.exports = {
  up: function (queryInterface, Sequelize) {
      let prods = _(items)
          .map((value) => _.extend(value, {createdAt: new Date(), updatedAt: new Date()}))
          .value()
      
      return queryInterface.bulkInsert('PresentationSlides', prods, {})
  },
  down: function (queryInterface, Sequelize) {
      return queryInterface.bulkDelete('PresentationSlides', null, {})
  }
};
