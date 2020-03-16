const dbm = require("./DBM");

class Users{
    async all(){
        try{
            const users = await dbm.all("users");
            return users
        }
        catch(e){
            throw {status:500, message:"Internal error", location: "pagesify.users.all"}
        }
    }
    async get(id){
        try{
            if(!id) throw {status:400, message: "The id is missing", location: "pagesify.users.get"}
            const user = await dbm.get("users",{id});
            return user[0]
        }
        catch(e){
            if(e.location) throw e
            throw {status: 500, message:"Internal error", location: "pagesify.users.get"}
        }
    }
    async create(id){
        try{
            if(!id) throw {status: 400, message:"The id is missing", location: "pagesify.users.create"}
            await dbm.create("users",{id,favourites:[]})
            return true;
        }
        catch(e){
            if(e.location) throw e
            throw {status: 500, message: "Internal error", location: "pagesify.users.create"}
        }
    }
    async updateFavourites(userInfo, pageId){
        try{
            const {id, favourites} = userInfo;
            if(!id || !favourites || !pageId)
                throw {status: 400, message:"One of the parameters requested is missing", location: "pagesify.users.updateFavourites"};
            if(favourites.includes(pageId)){
                const index = favourites.indexOf(pageId);
                favourites.splice(index,1);
            }
            else{
                userInfo.favourites.push(pageId);
            }
            await dbm.update("users",{id: userInfo.id},userInfo);
            return true
        }
        catch(e){
           if(e.location) throw e
           throw {status: 500, message:"Internal error", location:"pagesify.users.updateFavourites"}
        }
    }
}

module.exports = Users