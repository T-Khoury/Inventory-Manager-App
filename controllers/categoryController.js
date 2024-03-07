const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
// const { body, validationResult } = require("express-validator");

// exports.index = asyncHandler(async (req, res, next) => {
//     // res.send("NOT IMPLEMENTED: Site Home Page")
//     const [
//         numCategories,
//         numItems
//     ] = await Promise.all([
//         Category.countDocuments({}).exec(),
//         Item.countDocuments({}).exec(),
//     ])

//     res.render("index", {
//         title: "Plant Manager Home",
//         category_count: numCategories,
//         item_count: numItems,
//     })
// })

// Display list of all categories
exports.category_list = asyncHandler(async (req, res, next) => {
    const categories = await Category.find().sort({ createdAt: -1 }).exec();
    res.render("index", {
        title: "Plant Manager Home",
        categories: categories,
    })
});
//Display detail page for specific category
exports.category_detail = asyncHandler(async (req, res, next) => {
    const [category, itemsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id }).exec(),
    ]);

    if (category === null) {
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
    }

    res.render("category_detail", {
        title: "Category Detail",
        category: category,
        category_items: itemsInCategory,
    });
});


// Display category create form on GET.
exports.category_create_get = (req, res, next) => {
    // res.render("category_form", { title: "Create Category" });
    res.send("NOT IMPLEMENTED: Category create form");
}


// exports.category_create_post = [
//     body()
// ]

// exports.category_delete_get = asyncHandler(async (req, res, next) => {
//     res.render("category_delete", {
//         title: "Delete Category"
//     })
// });

// exports.category_delete_post = asyncHandler(async (req, res, next) => {
//     res.render("category_delete", {
//         title: "Delete Category"
//     })
// });

exports.category_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
})

exports.category_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
})
