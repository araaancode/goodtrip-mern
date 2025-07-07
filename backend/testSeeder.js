const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const drivers = require('./data/drivers');
const Driver = require('./models/Driver');
const buses = require('./data/buses');
const Bus = require('./models/Bus');
const connectDB = require('./config/db');

dotenv.config()

connectDB()

// import data => node importData.js -i
const importData = async () => {
  try {
    // import drivers
    await Driver.deleteMany()

    const sampleDrivers = drivers.map((driver) => {
      return { ...driver }
    })
    await Driver.insertMany(sampleDrivers)

    // import buses
    await Bus.deleteMany()

    const sampleBuses = buses.map((bus) => {
      return { ...bus }
    })
    await Bus.insertMany(sampleBuses)


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
    await Driver.deleteMany()
    await Bus.deleteMany()

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