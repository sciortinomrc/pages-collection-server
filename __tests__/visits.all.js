const dbm = require("../classes/DBM");
const Visits  = require("../classes/Visits");
const visits = new Visits();

test ( "I request all the visits, they are returned " ,async ()=>{

    dbm.all=jest.fn().mockReturnValue(Promise.resolve({data:["abc"]}))

    const result = await visits.all()
    expect(dbm.all).toHaveBeenCalledWith("visits")
    expect(result).toEqual({data:["abc"]})
})
test ( "I request all the visits, the connection is rejected, I get an error " ,async ()=>{

    dbm.all=jest.fn().mockReturnValue(Promise.reject(new Error()))

    let result = {status:null}
    try{
        await visits.all()
    }
    catch(e){
        result = e;
    }
    expect(result.status).toBe(500)
})