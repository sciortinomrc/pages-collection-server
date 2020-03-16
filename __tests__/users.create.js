const dbm = require("../classes/DBM");
const Users  = require("../classes/Users");
const users = new Users();

test ( "I request create a new user, they are returned " ,async ()=>{

    const id = "userid";
    dbm.create=jest.fn().mockReturnValue(Promise.resolve())

    const result = await users.create(id);
    expect(result).toBeTruthy();
})

test ( "I request create a new user, the id is missing. I get an error " ,async ()=>{

    dbm.create=jest.fn().mockReturnValue(Promise.resolve())

    let result={status:null};
    try{
        await users.create();
    }
    catch(e){
        result = e;
    }
    expect(result.status).toBe(400);
})
test ( "I request create a new user, the connection is rejected, I get an error " ,async ()=>{

    const id = "userid";
    dbm.create=jest.fn().mockReturnValue(Promise.reject(new Error()))

    let result={status:null};
    try{
        await users.create(id);
    }
    catch(e){
        result = e;
    }
    expect(result.status).toBe(500);
})