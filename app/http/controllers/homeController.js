const Menu = require("../../models/menu")

function homeController() {
    return {
        index(req, res){
            Menu.find().then(function (cakes) {
                return res.render("home", {cakes})  
            })
        }
    }
}

module.exports = homeController