const dbm = require("./DBM");

class Pages{
    async all(){
        try{
            const pages = await dbm.all("pages");
            return pages;
        }
        catch(e){
            throw {status:500, message:"Internal error", location: "pagesify.pages.all"}
        }
    }
    async add(pageInfo){
        try{
            const {id,name,url,type,likes,country,category,addedBy} = pageInfo;
            if(!id || !name || !url || !type || !likes || !country || !category || !addedBy)
                throw {status: 400, message: "One of the parameters requested is missing", location: "pagesify.pages.add"};
            await dbm.create("pages",{...pageInfo,favourites: 0});
            return true;

        }
        catch(e){
            if(e.location) throw e
            throw {status: 500, message: "Internal error", location:"pagesify.pages.add"};
        }
    }
    async remove(id){
        try{
            if(!id) throw {status:400, message:"The page id is missing", location: "pagesify.pages.remove"}
            await dbm.delete(id);
            return true;
        }
        catch(e){
            if(e.location) throw e
            throw {status: 500, message: "Internal error", location:"pagesify.pages.remove"}
        }
    }
    async update(pageInfo){
        try{
            const {id,name,url,type,likes,country,category,addedBy} = pageInfo;
            if(!id || !name || !url || !type || !likes || !country || !category || !addedBy)
                throw {status: 400, message: "One of the parameters requested is missing", location: "pagesify.pages.update"};
            await dbm.update("pages",{id: pageInfo.id},pageInfo);
            return true;
        }
        catch(e){
            if(e.location) throw e
            throw {status: 500, message:"Internal error", location:"pagesify.pages.update"}
        }
    }
    async updateFavourites(pageInfo){
        try{
            const {id,favourites} = pageInfo;
            if(!id || !favourites)
                throw {status: 400, message:"One of the parameters requested is missing", location: "pagesify.pages.updateFavourites"};
            await dbm.update("pages",{id: pageInfo.id},pageInfo);
            return true
        }
        catch(e){
           if(e.location) throw e
           throw {status: 500, message:"Internal error", location:"pagesify.pages.updateFavourites"}
        }
    }
}
module.exports = Pages;