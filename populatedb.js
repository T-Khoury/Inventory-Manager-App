#! /usr/bin/env node
const fs = require('fs');

// console.log(
//     'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
//   );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Item = require("./models/item");
  const Category = require("./models/category");
  
  const items = [];
  const categories = [];

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



  function readData() {
    fs.readFile('./plantdata.txt', 'utf8', (err, data) => {
        if (err) throw err;
        console.log(JSON.parse(data));
    })
  }
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
//   async function main() {
//     console.log("Debug: About to connect");
//     await mongoose.connect(mongoDB);
//     console.log("Debug: Should be connected?");
//     await createGenres();
//     await createAuthors();
//     await createBooks();
//     await createBookInstances();
//     console.log("Debug: Closing mongoose");
//     mongoose.connection.close();
//   }

  async function main() {
    await getData();
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    await createItems();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  // We pass the index to the ...Create functions so that, for example,
  // genre[0] will always be the Fantasy genre, regardless of the order
  // in which the elements of promise.all's argument complete.
  async function itemCreate(index, name, description, category, price, stock, images) {
    const itemdetail = { name: name, description: description, category: category, price: price, stock: stock };

    const item = new Item(itemdetail);

    await item.save();
    // items[index] = item;
    console.log(`Added item: ${name} ${description} ${category} ${price} ${stock}`);
  }

  async function categoryCreate(index, name, description) {
    const categorydetail = { name: name, description: description };

    const category = new Category(categorydetail);

    await category.save();
    console.log(`Added category: ${name} ${description}`);
  }

  
//   async function createGenres() {
//     console.log("Adding genres");
//     await Promise.all([
//       genreCreate(0, "Fantasy"),
//       genreCreate(1, "Science Fiction"),
//       genreCreate(2, "French Poetry"),
//     ]);
//   }
  
//   async function createAuthors() {
//     console.log("Adding authors");
//     await Promise.all([
//       authorCreate(0, "Patrick", "Rothfuss", "1973-06-06", false),
//       authorCreate(1, "Ben", "Bova", "1932-11-8", false),
//       authorCreate(2, "Isaac", "Asimov", "1920-01-02", "1992-04-06"),
//       authorCreate(3, "Bob", "Billings", false, false),
//       authorCreate(4, "Jim", "Jones", "1971-12-16", false),
//     ]);
//   }

async function getData() {
    let arrayofNums = randomInts(1, 1000);
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


    return plantData
  }

  async function createCategories() {
    plantData.forEach((data) => {
        if (!categories.includes(data.category.toLowerCase())) {
            categories.push(data.category.charAt(0).toUpperCase() + data.type.slice(1));
        }
    })
    console.log("Adding categories");
    await Promise.all(
       categories.forEach((category) => {
        categoryCreate(categories.indexOf(category), category, 'no description yet')
       }) 
    )
  }

  async function createItems() {

    plantData.forEach((data) => {
        items.push(data);
    })
    await Promise.all(
        items.forEach((item) => {
            itemCreate(items.indexOf(item), item.name, item.description, item.category, item.price, item.stock, item.images)
        })
    )
  }
