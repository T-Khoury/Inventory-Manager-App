const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Site Home Page")
})

// Display list of all categories
exports.category_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Category List");
});
//Display detail page for specific category
exports.category_detail = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Category detail page");
});


// Display category create form on GET.
exports.category_create_get = (req, res, next) => {
    // res.render("category_form", { title: "Create Category" });
    res.send("NOT IMPLEMENTED: Category create form");
}


exports.category_create_post = [
    body()
]

exports.category_delete_get = asyncHandler(async (req, res, next) => {
    res.render("category_delete", {
        title: "Delete Category"
    })
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
    res.render("category_delete", {
        title: "Delete Category"
    })
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
})

exports.category_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
})
