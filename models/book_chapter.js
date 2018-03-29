/**
 * Created by anthony on 28/03/2018.
 */
const DbObject = require('bkendz').DbObject

class BookChapter extends DbObject {
    
    static scopeDefs() {
        return {}
    }
    
    static isJunction(){
        return true
    }
    
    static columnDefs(DataTypes) {
        return {
            chapter: DataTypes.INTEGER,
            bookId: DataTypes.INTEGER
        }
    }
    
}

module.exports = BookChapter