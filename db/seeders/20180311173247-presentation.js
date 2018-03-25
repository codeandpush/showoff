'use strict';
const _ = require('lodash')
const moment = require('moment')

const items = [
    {
        title: 'Web Application Development for non-Coders',
        description: 'Two-part guide to website client and server-side build out.',
        createdById: 1
    },
    {
        title: 'Swift for non-iOS Development',
        description: 'Multi-part guide to setting up swift for development outside of iOS and macOS environments.',
        createdById: 1
    },
]

module.exports = {
  up: function (queryInterface, Sequelize) {
      let prods = _(items)
          .map((value) => _.extend(value, {createdAt: new Date(), updatedAt: new Date()}))
          .value()
      
      return queryInterface.bulkInsert('Presentations', prods, {})
  },
  down: function (queryInterface, Sequelize) {
      return queryInterface.bulkDelete('Presentations', null, {})
  }
};
