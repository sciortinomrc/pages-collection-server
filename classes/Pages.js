const DBM = require("./DBM");
const dbm = new DBM();

class Pages{
    async get(){
        const pages = await dbm.get();
        return pages;
    }
}
module.exports = Pages;