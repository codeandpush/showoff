/**
 * Created by anthony on 24/03/2018.
 */
const DbObject = require('bkendz').DbObject

class Slide extends DbObject {
    
    static scopeDefs() {
        return {
            withPresentation: function () {
                return {
                    include: [{
                        model: require('../models').Presentation
                    }]
                }
            }
        }
    }
    
    static columnDefs(DataTypes) {
        return {
            title: DataTypes.STRING,
            html: DataTypes.TEXT
        }
    }
    
    static associate(models) {
        models.Slide.belongsToMany(models.Presentation, {
            as: 'Presentations',
            through: models.PresentationSlide,
            foreignKey: 'slideId',
            otherKey: 'presentationId'
        })
        
    }
}

module.exports = Slide