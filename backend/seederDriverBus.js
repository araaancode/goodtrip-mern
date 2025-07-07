
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

const Driver = require('./models/Driver');
const Bus = require('./models/Bus');
const {drivers,buses} = require("./data/driversBusesData")

const connectDB = require('./config/db');

dotenv.config()

connectDB()

// import data => node importData.js -i
const importData = async () => {
  try {
    await Bus.deleteMany()
    await Driver.deleteMany()


    // import buses
    const sampleBuses = buses.map((bus) => {
      return { ...bus }
    })

    await Bus.insertMany(sampleBuses)


    // import drivers
    const sampleDrivers = drivers.map((driver) => {
      return { ...driver }
    })

    await Driver.insertMany(sampleDrivers)

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
    await Bus.deleteMany()
    await Driver.deleteMany()

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