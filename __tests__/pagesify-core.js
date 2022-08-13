const PagesifyCore = require('../classes/Pagesify-Core');
const pagesifyCore = new PagesifyCore();

const sh = require("shelljs")

const vespucciakabaudo = require("../resources/vespucciakabaudo.js");
const diariopippofrank = require("../resources/diariopippofrank.js");

test ( "I request vespucciakabaudo and the get the correct results ", async()=>{

    sh.exec=jest.fn().mockReturnValue({stdout: vespucciakabaudo});

    const pageInfo = pagesifyCore.pageInfo("vespucciakabaudo");

    expect(pageInfo.name).toEqual("Amerigo Vespucci: il Pippo Baudo della nautica");
    console.log({name: pageInfo.name});
    expect(pageInfo.likes).toBe(1561);
    console.log({likes: pageInfo.likes});
    expect(pageInfo.type).toEqual("Arcade");
    console.log({type: pageInfo.type})
} )


test ( "I request diariopippofrank and the get the correct results ", async()=>{

    sh.exec=jest.fn().mockReturnValue({stdout: diariopippofrank});

    const pageInfo = pagesifyCore.pageInfo("diariopippofrank");

    expect(pageInfo.name).toEqual("Il Diario di Pippo Frank");
    console.log({name: pageInfo.name});
    expect(pageInfo.likes).toBe(16511);
    console.log({likes: pageInfo.likes});
    expect(pageInfo.type).toEqual("Automotive, Aircraft & Boat");
    console.log({type: pageInfo.type})
} )