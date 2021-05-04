const mongoose = require("mongoose")
const Schema = mongoose.Schema

const orderSchema = new Schema({
    customerId : {type : mongoose.Schema.Types.ObjectId, ref : "User", required : true},
    customerName : {type : String, required : true},
    items : {type : Object, required : true},
    phone : {type : Number, required : true},
    address : {type : String, required : true},
    totalAmount : {type : Number, required : true},
    paymentStatus: { type: Boolean, default: false },
    paymentType : {type : String, default : "COD"},
    status : {type : String, default : "Order placed"}
},{timestamps : true})
const Order = mongoose.model("Order", orderSchema)

module.exports = Order