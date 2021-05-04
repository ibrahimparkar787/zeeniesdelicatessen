const mongoose = require("mongoose")
const Schema = mongoose.Schema

const categoriesSchema = new Schema({
    cat : {type : String, required : true},
    code : {type : String, required : true, unique : true},
}, { timestamps : true })
const Categories = mongoose.model("Categories", categoriesSchema)

module.exports = Categories