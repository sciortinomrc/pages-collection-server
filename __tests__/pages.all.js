const dbm = require("../classes/DBM");
const Pages  = require("../classes/Pages");
const pages = new Pages();

test ( "I request the pages, they are returned " ,async ()=>{

    dbm.all=jest.fn().mockReturnValue(Promise.resolve({data:["abc"]}))

    const result = await pages.all()
    expect(dbm.all).toHaveBeenCalledWith("pages")
    expect(result).toEqual({data:["abc"]})
})

test ( "I request the pages, connection is rejected " ,async ()=>{

    dbm.all=jest.fn().mockReturnValue(Promise.reject())

    try{
        await pages.all()
    }
    catch(e){
        expect(e.status).toBe(500);
    }
})