const dbm = require("./DBM");

class Visits{
    async addNew(){
        try{
            const createRequest = await dbm.create("visits",{date: new Date().toLocaleDateString(), count: 0});
            return createRequest[0]
        }
        catch(e){
            throw {status:500, message:"Internal error", location: "pagesify.visits.addNew"}
        }
    }
    async all(){
        try{
            return await dbm.all("visits");
        }
        catch(e){
            throw {status: 500, message: "Internal error", location: "pagesify.visits.all"}
        }
    }
    async get(){
        try{
            const visit =  await dbm.get("visits",{date: new Date().toLocaleDateString()});
            if(!visit.length) throw {status:404, message: "Not found", location: "pagesify.visits.get"}
            return visit[0]
        }
        catch(e){
            if(e.location) throw e
            throw {status: 500, message: "Internal error", location: "pagesify.visits.get"}
        }
    }
    async increment(currentCount){
        try{
            if(!currentCount) throw {status:400, message: "The current count is missing", location: "pagesify.visits.increment"}
            await dbm.update("visits",{date: new Date().toLocaleDateString(), count:currentCount+1});
            return true;
        }
        catch(e){
            if(e.location) throw e;
            throw {status:500, message:"Internal error", location: "pagesify.visits.increment"}
        }
    }
}

module.exports = Visits;