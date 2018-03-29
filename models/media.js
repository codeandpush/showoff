const DbObject = require('bkendz').DbObject

class Media extends DbObject {
    
    static scopeDefs() {
        return {}
    }
    
    static isJunction(){
        return true
    }
    
    static columnDefs(DataTypes) {
        return {
            presentationId: DataTypes.INTEGER,
            bookId: DataTypes.INTEGER
        }
    }
    
}

module.exports = Media