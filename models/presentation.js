const DbObject = require('bkendz').DbObject
const _ = require('lodash')

class Presentation extends DbObject {
    
    static scopeDefs() {
        return {}
    }
    
    static columnDefs(DataTypes){
        return {
            title: DataTypes.STRING,
            description: DataTypes.STRING,
            createdById: DataTypes.INTEGER
        }
    }
    
    getSlides() {
        const models = require('../models').sequelize.models
        let options = {include:[{model: models.Slide, as: 'slide'}],
            where: {
                presentationId: this.get('id')
            }
        }
        return models.PresentationSlide.findAll(options)
            .then((pSlides) => {
                return pSlides.map(ps => ps.slide)
            })
    }
    
    static associate(models) {
        models.Presentation.belongsTo(models.User, {
            foreignKey: 'createdById', as: 'createdBy'
        })
        
        models.Presentation.hasMany(models.PresentationSlide, {
            foreignKey: 'presentationId', as: 'presentationSlides'
        })
    }
}

module.exports = Presentation