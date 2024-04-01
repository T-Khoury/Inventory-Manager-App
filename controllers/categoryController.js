const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

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
    res.render("category_form", { title: "Create Category" });
}


exports.category_create_post = [
    body("name", "Category name must contain at least 3 characters")
        .trim()
        .isLength({ min: 3 })
        .escape(),
    body("description")
        .trim()
        .isLength({ min: 1, max: 100 })
        .escape(),
    
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const category = new Category({ name: capitalize(req.body.name), description: req.body.description });

        if (!errors.isEmpty()) {
            res.render("category_form", {
                title: "Create Category",
                category: category,
                errors: errors.array(),
            });
            return;
        } else {
            let categoryName = capitalize(req.body.name);
            const categoryExists = await Category.findOne({ name: categoryName }).exec();
            if (categoryExists) {
                res.redirect(categoryExists.url);
            } else {
                await category.save();
                res.redirect(category.url);
            }
        }
    }),
];

exports.category_delete_get = asyncHandler(async (req, res, next) => {
    const [category, itemsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id }, "name description").exec(),
    ]);

    if (category === null) {
        res.redirect("/inventory/categories");
    }
    
    res.render("category_delete", {
        title: "Delete Category",
        category: category,
        category_items: itemsInCategory,
    });
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
    const [category, itemsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id }, "name description").exec(),
    ]);

    if (itemsInCategory.length > 0) {
        res.render("category_delete", {
            title: "Delete Category",
            category: category,
            category_items: itemsInCategory
        });
        return;
    } else {
        await Category.findByIdAndDelete(req.body.categoryid);
        res.redirect("/inventory/categories");
    }
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id).exec();

    if (category === null) {
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
    }

    res.render("category_form", { title: "Update Category", category: category });
})

exports.category_update_post = [
    body("name", "Category name must contain at least 3 characters")
        .trim()
        .isLength({ min: 3 })
        .escape(),
    body("description")
        .trim()
        .isLength({ min: 1, max: 1000 })
        .escape(),
    
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const category = new Category({ name: capitalize(req.body.name), description: req.body.description, _id: req.params.id });

        if (!errors.isEmpty()) {
            res.render("category_form", {
                title: "Create Category",
                category: category,
                errors: errors.array(),
            });
            return;
        } else {
            await Category.findByIdAndUpdate(req.params.id, category, {});
            res.redirect(category.url);
        }
    }),
];
