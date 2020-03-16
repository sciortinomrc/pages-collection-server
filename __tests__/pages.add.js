const dbm = require("../classes/DBM");
const Pages  = require("../classes/Pages");
const pages = new Pages();

test ( "I add a page, it's added correctly " ,async ()=>{
    const info = {
        id: "pageid",
        name: "pagename",
        url : "pageurl",
        category: "pagecategory",
        type: "pagetype",
        country: "pagecountry",
        likes : "pagelikes",
        addedBy: "userid"
    }

    dbm.create=jest.fn().mockReturnValue(Promise.resolve(true))

    const result = await pages.add(info)
    expect(dbm.create).toHaveBeenCalledWith("pages",{...info,favourites:0});
    expect(result).toBeTruthy();
})

test ( "I add a page, one parameter is missing, I receive an error " ,async ()=>{
    const info = {
        id: "pageid",
        name: "pagename",
        url : "pageurl",
        category: "pagecategory",
        type: "pagetype",
        country: "pagecountry",
        likes : "pagelikes",
    }

    dbm.create=jest.fn().mockReturnValue(Promise.resolve(true))

    let result={status:null};
    try{
        await pages.add(info);
    }
    catch(e){
        result = e;
    }
    expect(result.status).toBe(400);
})

test ( "I add a page, connection is rejected, I receive an error " ,async ()=>{
    const info = {
        id: "pageid",
        name: "pagename",
        url : "pageurl",
        category: "pagecategory",
        type: "pagetype",
        country: "pagecountry",
        likes : "pagelikes",
        addedBy: "userid"
    }

    dbm.create=jest.fn().mockReturnValue(Promise.reject(new Error()))

    let result={status:null};
    try{
        await pages.add(info);
    }
    catch(e){
        result = e;
    }
    expect(result.status).toBe(500);
})
