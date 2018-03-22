const DbObject = require('bkendz').DbObject

class Presentation extends DbObject {
    
    static scopeDefs() {
        return {}
    }
    
    static columnDefs(DataTypes) {
        return {
            title: DataTypes.STRING,
            description: DataTypes.STRING,
        }
    }
    
    static associate(models) {
    
    }
}

module.exports = Presentation