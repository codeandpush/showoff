'use strict';
const _ = require('lodash')
const moment = require('moment')

const items = [
    {
        title: 'Electric Bike - 100 Mile Range!',
        description: 'Electric bike, 100 mile range, USB ports, 5 level pedal assist. ',
        createdById: 1
    },
    {
        title: 'Epson EB-S31 Portable Projector',
        description: `High-quality mobile projector ideal for home or office presentation use, with 3LCD technology and SVGA resolution.

Easy to move and quick to set up, the projector comes in a carrying bag with remote control, power supply, VGA and USB cables and manual.

Epson EB-S31 Projector Spec

Lumens: 3200 (Eco mode: 2400)
Resolution: SVGA (800 x 600)
Contrast Ratio: 15000:1
Connection: USB or SVGA
Sound: 2W integrated speaker
Zoom: 1.35 x digital zoom
+ Automatic vertical keystone correction

Portable tripod projector screen (152x152cm) also available - see separate listing.

Any questions, feel free to get in touch!`,
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
