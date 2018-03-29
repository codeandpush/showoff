/**
 * Created by anthony on 28/03/2018.
 */
const DbObject = require('bkendz').DbObject

class Book extends DbObject {
    
    static scopeDefs() {
        return {}
    }
    
    static columnDefs(DataTypes) {
        return {
            tocId: DataTypes.INTEGER
        }
    }
    
}

module.exports = Book