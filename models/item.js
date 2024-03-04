const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    description: { type: String, required: true, maxLength: 1000 },
    category: { type: Schema.Types.ObjectId, ref: "Category"},
    price: { type: String, required: true },
    stock: { type: Number, required: true },
    images: { type: Array },
})

ItemSchema.virtual("url").get(function () {
    return `/inventory/item/${this._id}`;
})


module.exports = mongoose.model("Item", ItemSchema);