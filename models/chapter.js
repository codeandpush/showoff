/**
 * Created by anthony on 28/03/2018.
 */
const DbObject = require('bkendz').DbObject

class Chapter extends DbObject {
    
    static scopeDefs() {
        return {}
    }
    
    static columnDefs(DataTypes) {
        return {
            content: DataTypes.TEXT
        }
    }
    
}

module.exports = Chapter