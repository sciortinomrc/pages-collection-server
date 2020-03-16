const dbm = require("../classes/DBM");
const Pages  = require("../classes/Pages");
const pages = new Pages();

test ( "I update the favourites count of a page, it's correctly updated" ,async ()=>{
    const info = {
        id: "pageid",
        favourites: 5
    }

    dbm.update=jest.fn().mockReturnValue(Promise.resolve(true))

    const result = await pages.updateFavourites(info)
    expect(dbm.update).toHaveBeenCalledWith("pages",{id: info.id},expect.objectContaining({favourites: 5}))
    expect(result).toBeTruthy();
})
test ( "I update the favourites count of a page, on parameter is missing, I get an error" ,async ()=>{
    const info = {
        id: "pageid"
    }

    dbm.update=jest.fn().mockReturnValue(Promise.resolve(true))
    
    let result={status:null};
    try{
        await pages.updateFavourites(info)
    }
    catch(e){
        result=e;
    }
    expect(result.status).toBe(400);
})
test ( "I update the favourites count of a page, the connection is rejected, I get an error" ,async ()=>{
    const info = {
        id: "pageid",
        favourites: 5
    }

    dbm.update=jest.fn().mockReturnValue(Promise.reject(new Error()))
    
    let result={status:null};
    try{
        await pages.updateFavourites(info)
    }
    catch(e){
        result=e;
    }
    expect(result.status).toBe(500);
})