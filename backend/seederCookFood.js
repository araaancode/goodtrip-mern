
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

const Cook = require('./models/Cook');
const Food = require('./models/Food');
// const Driver = require('./models/Driver');
// const Bus = require('./models/Bus');
const {foods,cooks} = require("./data/cooksFoodsData")
// const drivers=require("./data/drivers")
// const buses = require("./data/buses")

const connectDB = require('./config/db');

dotenv.config()

connectDB()

// import data => node importData.js -i
const importData = async () => {
  try {
    await Food.deleteMany()
    await Cook.deleteMany()


    // import Foods
    const sampleFoods = foods.map((food) => {
      return { ...food }
    })

    await Food.insertMany(sampleFoods)


    // import Cooks
    const sampleCooks = cooks.map((cook) => {
      return { ...cook }
    })

    await Cook.insertMany(sampleCooks)

    console.log('Data Imported!'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

// delete data => node importData.js -d
const destroyData = async () => {
  try {
    // await Bus.deleteMany()
    await Food.deleteMany()
    await Cook.deleteMany()

    // await Driver.deleteMany()

    console.log('Data Destroyed!'.red.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}