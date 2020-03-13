const DBM = require("../classes/DBM");

const Pages  = require("./classes/Pages");
const pages = new Pages();

test ( "I request the pages, they are returned " ,async ()=>{
    DBM.get=jest.fn().mockReturnValue(Promise.resolve({data:["abc"]}))

    const result = await pages.get();
    expect(result).toEqual({data:["abc"]})
})