const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    description: { type: String, required: true, maxLength: 100 },
    category: { type: Schema.Types.ObjectId, ref: "Category"},
    price: { type: String, required: true },
    stock: { type: Number, required: true },
})

ItemSchema.virtual("url").get(function () {
    return `/catalog/item/${this._id}`;
})


module.exports = mongoose.model("Item", ItemSchema);