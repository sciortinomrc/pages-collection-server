const sh = require("shelljs");

class PagesifyCore{
    getPage(id){
        let html = sh.exec("curl https://m.facebook.com/pg/"+id+"/community/").stdout;
        return html;
    }
    getName(html){
        let name = html.split("<title>")[1]
            .split("</title>")[0]
            .split("|")[0]
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
        let likes = html.split('id="pages_msite_body_contents"')
        .split("<td>")[1]
        .split("</td>")[0]
        .split("</div>")[0]
        .split(">")[1];
        likes = likes.replace(",","").replace(" ","");
        return likes*1;
    }
    pageInfo(id){
        const pageRaw = this.getPage(id);
        const name = this.getName(pageRaw);
        const likes = this.getLikes(pageRaw);
        const type = this.getCategory(pageRaw);

        console.log({name,likes,type})

        return {name,likes,type};
    }
}

module.exports = PagesifyCore;