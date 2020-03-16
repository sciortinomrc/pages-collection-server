const dbm = require("../classes/DBM");
const Visits  = require("../classes/Visits");
const visits = new Visits();

test ( "I record a new visit, it's correctly stored " ,async ()=>{
    const returnValue = {date: new Date().toLocaleDateString(), count:0}
    dbm.create=jest.fn().mockReturnValue(Promise.resolve([returnValue]))

    const result = await visits.addNew();
    expect(dbm.create).toHaveBeenCalledWith("visits",returnValue)
    expect(result).toEqual(returnValue);
})

test ( "I record a new visit, the connection is rejected " ,async ()=>{
    dbm.create=jest.fn().mockReturnValue(Promise.reject(new Error()))

    let result ={status:null};
    try{
        await visits.addNew();
    }
    catch(e){
        result = e;
    }
    expect(result.status).toBe(500);
})