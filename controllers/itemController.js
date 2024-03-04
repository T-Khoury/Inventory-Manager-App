const Item = require("../models/item");
const asyncHandler = require("express-async-handler");



// Display list of all itemss
exports.item_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item List");
});
//Display detail page for specific category
exports.item_detail = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Item detail page");
});


// Display category create form on GET.
exports.item_create_get = (req, res, next) => {
    // res.render("category_form", { title: "Create Category" });
    res.send("NOT IMPLEMENTED: Item create form");
}


exports.item_create_post = [
    body()
]

exports.item_delete_get = asyncHandler(async (req, res, next) => {
    res.render("item_delete", {
        title: "Delete Item"
    })
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
    res.render("item_delete", {
        title: "Delete Item"
    })
});

exports.item_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
})

exports.item_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
})
