const dbm = require("../classes/DBM");
const Pages  = require("../classes/Pages");
const pages = new Pages();

test ( "I delete a page, it's deleted correctly " ,async ()=>{
    const id= "pageid";

    dbm.delete=jest.fn().mockReturnValue(Promise.resolve(true))

    const result = await pages.remove(id)
    expect(dbm.delete).toHaveBeenCalledWith(id);
    expect(result).toBeTruthy();
})

test ( "I delete a page, the id param is missing, I get an error " ,async ()=>{

    dbm.delete=jest.fn().mockReturnValue(Promise.resolve(true))

    let result = {status: null};
    try{
        await pages.remove()
    }
    catch(e){
        result = e;
    }
    expect(result.status).toBe(400);
})

test ( "I delete a page, the connection is rejected, I get an error " ,async ()=>{
    const id= "pageid";

    dbm.delete=jest.fn().mockReturnValue(Promise.reject(new Error()))

    let result = {status: null};
    try{
        await pages.remove(id)
    }
    catch(e){
        result = e;
    }
    expect(result.status).toBe(500);
})