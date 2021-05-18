//Controllers
const homeController = require("../app/http/controllers/homeController")
const authController = require("../app/http/controllers/authController")
const cartController = require("../app/http/controllers/customers/cartContoller")
const orderController = require("../app/http/controllers/customers/orderController")
const adminOrderController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')

//Middlewares
const guest = require("../app/http/middleware/guest")
const auth = require("../app/http/middleware/auth")
const admin = require("../app/http/middleware/admin")

function initRoutes(app) {
    app.get("/", homeController().index)
    //Auth
    app.get("/login", guest, authController().login)
    app.post("/login", authController().postLogin)
    app.post("/logout", authController().logout)
    app.get("/register", guest, authController().register)
    app.post("/register", authController().postRegister)
    //Cart
    app.get("/cart", auth, cartController().index)
    app.post("/update-cart", cartController().update)
    app.post("/remove-item", cartController().remove)
    //Orders
    app.post("/orders", orderController().store)
    app.get("/customers/orders", auth, orderController().index)
    app.get("/customers/orderStatus/:id", auth, orderController().show)
    app.get("/customers/orderStatus/show/:id", auth,orderController().invoice)

    //Admin
    app.get("/admin/orders", admin, adminOrderController().index)
    app.post("/admin/order/status", admin, statusController().update)
    
    //About Us
    app.get("/aboutUs", (req, res)=> {
    res.render("aboutUs")
})
}

module.exports = initRoutes