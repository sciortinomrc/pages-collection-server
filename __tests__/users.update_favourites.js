const dbm = require("../classes/DBM");
const Users  = require("../classes/Users");
const users = new Users();

test ( "I update the favourites of a user, the page is not a favourite, it's correctly updated" ,async ()=>{
    const info = {
        id: "userid",
        favourites: []
    }
    const pageId = "pageid";

    dbm.update=jest.fn().mockReturnValue(Promise.resolve(true))

    const result = await users.updateFavourites(info,pageId)
    expect(dbm.update).toHaveBeenCalledWith("users",{id: info.id},expect.objectContaining({favourites: ["pageid"]}))
    expect(result).toBeTruthy();
})
test ( "I update the favourites of a user, the page is a favourite, it's removed correctly" ,async ()=>{
    const info = {
        id: "userid",
        favourites: ["pageid"]
    }
    const pageId = "pageid";

    dbm.update=jest.fn().mockReturnValue(Promise.resolve(true))

    const result = await users.updateFavourites(info,pageId)
    expect(dbm.update).toHaveBeenCalledWith("users",{id: info.id},expect.objectContaining({favourites: []}))
    expect(result).toBeTruthy();
})
test ( "I update the favourites count of a user, on parameter is missing, I get an error" ,async ()=>{
    const info = {
        id: "userid"
    }

    dbm.update=jest.fn().mockReturnValue(Promise.resolve(true))
    
    let result={status:null};
    try{
        await users.updateFavourites(info)
    }
    catch(e){
        result=e;
    }
    expect(result.status).toBe(400);
})
test ( "I update the favourites count of a user, the connection is rejected, I get an error" ,async ()=>{
    const info = {
        id: "userid",
        favourites: []
    }
    const pageId= "pageid"

    dbm.update=jest.fn().mockReturnValue(Promise.reject(new Error()))
    
    let result={status:null};
    try{
        await users.updateFavourites(info,pageId)
    }
    catch(e){
        result=e;
    }
    expect(result.status).toBe(500);
})