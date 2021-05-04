const Order = require("../../../models/order")
const User = require("../../../models/user")
const fs = require("fs")
const invoice =require("../customers/invoiceContoller")
const moment = require("moment")
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
function orderController() {
    return {
        store(req, res) {
            // Request Validation
            const { phone, address, stripeToken, paymentType } = req.body
            if(!phone || !address) {
                return res.status(422).json({ message : 'All fields are required' });  
            }
            //Creating a new order
            const order = new Order({
                customerId : req.user._id,
                customerName : req.user.name,
                items : req.session.cart.items,
                phone,
                address,
                totalAmount : req.session.cart.totalPrice

            })
            order.save().then(result => {
                Order.populate(result, { path: "customerId" }, (err, placedOrder) => {
                    if(paymentType === 'card') {
                        stripe.charges.create({
                            amount: req.session.cart.totalPrice  * 100,
                            source: stripeToken,
                            currency: 'inr',
                            description: `Cake order: ${placedOrder._id}`
                        }).then(() => {
                            placedOrder.paymentStatus = true
                            placedOrder.paymentType = paymentType
                            placedOrder.save().then((ord) => {
                                // Emit
                                const eventEmitter = req.app.get('eventEmitter')
                                eventEmitter.emit('orderPlaced', ord)
                                delete req.session.cart
                                return res.json({ message : 'Payment successful, Order placed successfully' });
                            }).catch((err) => {
                                console.log(err)
                            })

                        }).catch((err) => {
                            delete req.session.cart
                            return res.json({ message : 'OrderPlaced but payment failed, You can pay at delivery time' });
                        })
                    } else {
                        delete req.session.cart
                        return res.json({ message : 'Order placed succesfully' });
                    }
                })
            }).catch(err => {
                return res.status(500).json({ message : 'Something went wrong' });
            })
        },
        async index(req, res) {
           const orders = await Order.find({customerId : req.user._id},
            null, 
            { sort: { "createdAt": -1 } } )
            res.header("Cache-Control", "no-store")
           res.render("customers/orders", {orders : orders, moment: moment})
        },
        async show(req, res) {
            const order = await Order.findById(req.params.id)
            let usid = {id : req.user._id}
            let cuid = {custId : order.customerId}
            if ( usid.toString() === cuid.toString()) {
                return res.render("customers/orderStatus", { order : order })
            }
            return res.redirect("/")
        },
        async invoice(req, res) {
            const order = await Order.findById(req.params.id)
            const cust = await User.find({_id:order.customerId},{name:1,_id:0})
            order.name = cust.name

            order.name = cust[0].name
            // Authorize user
            let filePath = './'+req.params.id+".pdf"
            invoice.createInvoice(order,req.params.id+'.pdf',function(rep){
                if(rep.success){

                    res.download(filePath,function(err){
                        fs.unlink(filePath, (err) => {});
                      });
                }
            })
        }
    }
}
module.exports = orderController 