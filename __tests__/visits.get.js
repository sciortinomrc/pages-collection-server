const dbm = require("../classes/DBM");
const Visits  = require("../classes/Visits");
const visits = new Visits();

test ( "I request get the visit, they are returned " ,async ()=>{

    dbm.get=jest.fn().mockReturnValue(Promise.resolve([{data:["abc"]}]))

    const result = await visits.get();
    expect(dbm.get).toHaveBeenCalledWith("visits",{date: new Date().toLocaleDateString()})
    expect(result).toEqual({data:["abc"]})
})

test ( "I request get the visit, it's not found " ,async ()=>{

    dbm.get=jest.fn().mockReturnValue(Promise.resolve([]))

    let result={status:null};
    try{
        await visits.get();
    }
    catch(e){
        result = e
    }
    expect(result.status).toBe(404)
})

test ( "I request get the visit, it's not found " ,async ()=>{

    dbm.get=jest.fn().mockReturnValue(Promise.reject(new Error()));

    let result={status:null};
    try{
        await visits.get();
    }
    catch(e){
        result = e
    }
    expect(result.status).toBe(500)
})