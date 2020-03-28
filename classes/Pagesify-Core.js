const sh = require("shelljs");

class PagesifyCore{
    getPage(id){
        let html = sh.exec("curl https://m.facebook.com/"+id+"/community/").stdout;
        return html;
    }
    getName(html){
        let name = html.split("<title>")[1]
            .split("</title>")[0]
            .split("-")[0]
            .replace("&#039;","'")
            .trim();
        return name;
    }
    getCategory(html){
        const category = html.split('id="cover"')[1]
            .split("</h1>")[1]
            .split("<span")[1]
            .split("</span")[0]
            .split(">")[1];
        return category;
    }
    getLikes(html){
        let likes = html.split('id="pages_msite_body_contents"')[1]
            .split("<td")[1]
            .split("</td>")[0]
            .split("</div>")[0]
            .split(">")[2];
        likes = likes.replace(",","").replace(" ","");
        return likes*1;
    }
    processId(id){
        if(id.includes("https://www.facebook.com")){
            const idSplit = id.split("/");
            if(idSplit[idSplit.length-1]=="") idSplit.pop();
            id=idSplit[idSplit.length-1];
        }
        const idSplit = id.split("-");
        const last = idSplit[idSplit.length-1];
        if(last.length>6 && !isNaN(1*last))
            return last
        return id;
    }
    pageInfo(id){
        id = this.processId(id)
        const pageRaw = this.getPage(id);
        const name = this.getName(pageRaw);
        const likes = this.getLikes(pageRaw);
        const type = this.getCategory(pageRaw);

        return {id,name,likes,type};
    }
}

module.exports = PagesifyCore;