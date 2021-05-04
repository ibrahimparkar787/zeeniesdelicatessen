const mongoose = require("mongoose")
const Schema = mongoose.Schema

const menuSchema = new Schema({
    name : {type : String, required : true},
    image : {type : String, required : true},
    price : {type : Number, required : true},
    size : {type : String, required : true},
    cat : {type : mongoose.Schema.Types.String, ref : "Categories", required : true}
})
const Menu = mongoose.model("Menu", menuSchema)

module.exports = Menu