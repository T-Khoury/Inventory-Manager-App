const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");


function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Display list of all itemss
exports.item_list = asyncHandler(async (req, res, next) => {
    const items = await Item.find().sort({ createdAt: -1 }).exec();
    res.render("item_list", {
        title: "All Items",
        items: items,
    })
});
//Display detail page for specific category
exports.item_detail = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).exec();

    

    if (item === null) {
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
    }

    res.render("item_detail", {
        title: "Item Detail",
        item: item,
    });
});


// Display category create form on GET.
exports.item_create_get = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find().sort({ name: 1 }).exec();

    res.render("item_form", {
        title: "Create Item",
        categories: allCategories,
    });
});


exports.item_create_post = [
    body("name", "Name must not be empty.")
        .trim()
        .isLength({ min: 1, max: 100 })
        .escape(),
    body("description", "Description must not be empty.")
        .trim()
        .isLength({ min: 1, max: 1000 })
        .escape(),
    body("category", "Category must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("price", "Price must not be empty.")
        .trim()
        .isFloat({ min: 0.00, max: 99.99 })
        .escape(),
    body("stock", "Stock must not be empty.")
        .trim()
        .isInt({ min: 0 })
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const item = new Item({
            name: capitalize(req.body.name), 
            description: req.body.description,
            category: req.body.category,
            price: `$${req.body.price}`,
            stock: req.body.stock,
        });

        if (!errors.isEmpty()) {

            const allCategories = await Category.find().sort({ name: 1 }).exec();

            res.render("item_form", {
                title: "Create Item",
                item: item,
                categories: allCategories,
                errors: errors.array(),
            });
        } else {
            await item.save();
            res.redirect(item.url);
        }
    })

];

// exports.item_delete_get = asyncHandler(async (req, res, next) => {
//     res.render("item_delete", {
//         title: "Delete Item"
//     })
// });

// exports.item_delete_post = asyncHandler(async (req, res, next) => {
//     res.render("item_delete", {
//         title: "Delete Item"
//     })
// });

exports.item_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
})

exports.item_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED");
})
