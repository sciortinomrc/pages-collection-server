const sh = require("shelljs");
const {JSDOM} = require("jsdom");
const jQuery = require("jquery")

class PagesifyCore{

    getDom(html) { 
        const dom = new JSDOM(html, {})
        const $ = jQuery(dom.window)
        return $
    }

    getPage(id){
        let html = sh.exec("curl https://m.facebook.com/"+id+"/community/",{silent: true}).stdout;
        return html;
    }
    getName(html){
        const $ = this.getDom(html)
        let name = $("title").text()
            .split("-")[0]
            .replace("&#039;","'")
            .trim();
        return name;
    }
    getCategory(html){
        const $ = this.getDom(html)
        const category = $("#cover a > span").text()
        return category;
    }
    getLikes(html){
        const $ = this.getDom(html)
        let likes = $("#pages_msite_body_contents td div").html()
        likes = likes.replace(",","").replace(" ","");
        return likes*1;
    }
    processId(id){
        if(id.includes("facebook.com/")){
            const idSplit = id.split("/");
            if(idSplit[idSplit.length-1]=="") idSplit.pop();
            id=idSplit[idSplit.length-1]
        }
        const idSplit = id.split("-");
        const last = idSplit[idSplit.length-1];
        if(last.length>6 && !isNaN(1*last))
            return last
        return id;
    }
    pageInfo(id){
        id = this.processId(id);
        const pageRaw = this.getPage(id);
        const name = this.getName(pageRaw);
        const likes = this.getLikes(pageRaw);
        const type = this.getCategory(pageRaw);

        return {id,name,likes,type};
    }
}

module.exports = PagesifyCore;