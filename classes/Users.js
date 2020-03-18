const dbm = require("./DBM");

class Users{

    handleFavourites(user){
        if(!user.favourites.length) 
                user.favourites=[]
        else
            user.favourites = user.favourites.split("|");
    }
    async all(){
        try{
            const users = await dbm.all("users");
            for(const user of users){
                this.handleFavourites(user);
            }
            return users
        }
        catch(e){
            console.log(e)
            throw {status:500, message:"Internal error", location: "pagesify.users.all"}
        }
    }
    async get(id){
        try{
            if(!id) throw {status:400, message: "The id is missing", location: "pagesify.users.get"}
            const user = await dbm.get("users",{id});
            this.handleFavourites(user[0]);
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
            await dbm.create("users",{id,favourites:""})
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
            userInfo.favourites=userInfo.favourites.join("|");
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