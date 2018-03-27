/**
 * Created by anthony on 25/03/2018.
 */
const DbObject = require('bkendz').DbObject

class PresentationSlide extends DbObject {
    
    static scopeDefs() {
        return {}
    }
    
    static isJunction() {
        return true
    }
    
    static columnDefs(DataTypes) {
        return {
            presentationId: DataTypes.INTEGER,
            no: DataTypes.INTEGER,
            name: DataTypes.STRING,
            slideId: DataTypes.INTEGER
        }
    }
    
    static associate(models) {
        models.PresentationSlide.belongsTo(models.Presentation, {
            foreignKey: 'presentationId', as: 'presentation'
        })
    
        models.PresentationSlide.belongsTo(models.Slide, {
            foreignKey: 'slideId',
            constraints: false,
            as: 'slide'
        })
    }
}

module.exports = PresentationSlide