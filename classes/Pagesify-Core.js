const sh = require("shelljs");

class PagesifyCore{
    getPage(id){
        let html = sh.exec("curl https://www.facebook.com/"+id).stdout;
        return html;
    }
    getName(html){
        let fraction = html.split("www.facebook.com")[2];
        fraction = fraction.split("title")[1].split("/")[0];
        const name = fraction.replace(/"/g,"").replace(/=/g,"").trim();
        return name;
    }
    getLikes(html){
        let fraction = html.split("/likes")[2];
        let likes = fraction.split(">")[3].split("<")[0];
        likes = likes.replace(",","").replace(" ","");
        return likes*1;
    }
    getCategory(html){
        const category = html.split("/pages/category/")[1].split("<")[0].split(">")[1]
        return category;
    }
    pageInfo(id){
        const pageRaw = this.getPage(id);
        const name = this.getName(pageRaw);
        const likes = this.getLikes(pageRaw);
        const type = this.getCategory(pageRaw);

        return {name,likes,type};
    }
}

module.exports = PagesifyCore;