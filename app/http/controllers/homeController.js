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

/* const Menu = require("../../models/menu")
const Category = require("../../models/categories")
function homeController() {
    return {
        index(req, res){
            Menu.find().then(function (menu) {
                Category.find().then(function(categories){
                    return res.render("home", {menus : menu,categories : category})
                })

            })
        }
        
    }
}

module.exports = homeController */