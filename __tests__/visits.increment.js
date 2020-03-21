const dbm = require("../classes/DBM");
const Visits  = require("../classes/Visits");
const visits = new Visits();

test ( "I increment the visits count, it's correctly incremented " ,async ()=>{

    const currentCount = 1;
    dbm.update=jest.fn().mockReturnValue(Promise.resolve())

    const result = await visits.increment(currentCount);
    expect(dbm.update).toHaveBeenCalledWith("visits",{date: new Date().toLocaleDateString()},{count: currentCount+1})
    expect(result).toBeTruthy();
})

test ( "I increment the visits count, currentCount is missing, I get an error " ,async ()=>{

    dbm.update=jest.fn().mockReturnValue(Promise.resolve())

    let result;
    try{
        await visits.increment();
    }
    catch(e){
        result = e;
    }
    expect(result.status).toBe(400);
})
test ( "I increment the visits count, the connection is rejected, I get an error " ,async ()=>{

    const currentCount = 1;

    dbm.update=jest.fn().mockReturnValue(Promise.reject(new Error()))

    let result;
    try{
        await visits.increment(currentCount);
    }
    catch(e){
        result = e;
    }
    expect(result.status).toBe(500);
})