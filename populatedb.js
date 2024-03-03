#! /usr/bin/env node
const fs = require('fs');


  const userArgs = process.argv.slice(2);
  
  const Item = require("./models/item");
  const Category = require("./models/category");
  
  const items = [];
  const categories = [];

  const itemsData = [];
  const categoriesData = [];

  let plantData;

  function randomInts(quantity, max){
    const set = new Set()
    while(set.size < quantity) {
      set.add(Math.floor(Math.random() * max))
    }
    return Array.from(set)
  }
  function randomPrice() {
    return `$${Math.floor(Math.random() * 100)}.99`
  }

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function readData() {
    fs.readFile('./plantdata.txt', 'utf8', (err, data) => {
        if (err) throw err;
        console.log(JSON.parse(data));
    })
  }

  const mongoose = require("mongoose");
const category = require('./models/category');
  mongoose.set("strictQuery", false);
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));

  async function main() {
    await getData();
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    console.log('in between');
    await createItems();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }

  async function categoryFind(itemCategory) {
    let categoryName = capitalize(itemCategory);
    const categoryMatch = await category.findOne({ name: `${categoryName}` }).exec();
    console.log(categoryMatch);
    return categoryMatch;
  }
  
  
  async function itemCreate(index, name, description, category, price, stock, images) {
    let categoryMatch = await categoryFind(category);
    console.log('here');
    const itemdetail = { name: capitalize(name), description: description, category: categoryMatch._id, price: price, stock: stock, images: images };

    const item = new Item(itemdetail);
    console.log(item);
    await item.save();
    items[index] = item;
    console.log(`Added item: ${name} ${description} ${category} ${price} ${stock}`);
  }

  async function categoryCreate(index, name, description) {
    console.log(index, name, description);
    const categorydetail = { name: name, description: description };

    const category = new Category(categorydetail);
    console.log(category);
    await category.save();
    console.log(category, 'jjj');
    categories[index] = category;
    console.log(`Added category: ${name} ${description}`);
  }


async function getData() {
    let arrayofNums = randomInts(30, 1000);
    let urls = arrayofNums.map((num) => `https://perenual.com/api/species/details/${num}?key=sk-wlgJ65df6395685114381`);

    plantData = await Promise.all(
        urls.map(async (url) => {
            const response = await fetch(url);
            const plantJson = await response.json();
            console.log (plantJson.id)
            return { id: plantJson.id, name: plantJson.common_name, description: plantJson.description, category: plantJson.type, images: plantJson.default_image, stock: Math.floor(Math.random() * 101), price: randomPrice() }
        })
    )
    fs.writeFile('./plantdata.txt', JSON.stringify(plantData), (err) => {
        if (err) {
            throw new Error('Something went wrong.')
        }})
    
    plantData.forEach((data) => {
        if (!categoriesData.includes(capitalize(data.category.toLowerCase()))) {
            categoriesData.push(capitalize(data.category));
        }
    })
    plantData.forEach((data) => {
        itemsData.push(data);
    })
    return plantData
  }

  async function createCategories() {
    await Promise.all(
       categoriesData.map(async (category) => {
        await categoryCreate(categoriesData.indexOf(category), category, 'no description yet')
       }) 
    )
    
  }

  async function createItems() {
    console.log("Adding items");
    await Promise.all(
        itemsData.map(async (item) => {
            await itemCreate(itemsData.indexOf(item), item.name, item.description, item.category, item.price, item.stock, item.images)
        })
    )
  }
