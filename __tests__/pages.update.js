const dbm = require("../classes/DBM");
const Pages  = require("../classes/Pages");
const pages = new Pages();

test ( "I update a page, it's correctly updated" ,async ()=>{
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

    dbm.update=jest.fn().mockReturnValue(Promise.resolve(true));

    const result = await pages.update(info)
    expect(dbm.update).toHaveBeenCalledWith("pages",{id: info.id},info)
    expect(result).toBeTruthy();
})

test ( "I update a page, a parameter is missing, I get an error " ,async ()=>{
    const info = {
        name: "pagename",
        url : "pageurl",
        category: "pagecategory",
        type: "pagetype",
        country: "pagecountry",
        likes : "pagelikes",
        addedBy: "userid"
    }

    dbm.update=jest.fn().mockReturnValue(Promise.resolve(true))

    let result;
    try{
       await pages.update(info)
    }
    catch(e){
        result = e;
    }
    expect(result.status).toBe(400);
})
test ( "I update a page, the connection is rejected, I get an error " ,async ()=>{
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

    dbm.update=jest.fn().mockReturnValue(Promise.reject(new Error()))

    let result;
    try{
       await pages.update(info)
    }
    catch(e){
        result = e;
    }
    expect(result.status).toBe(500);
})