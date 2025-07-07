
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

const Owner = require('./models/Owner');
const House = require('./models/House');
// const Driver = require('./models/Driver');
// const Bus = require('./models/Bus');
const {houses,owners} = require("./data/ownersHousesData")
// const drivers=require("./data/drivers")
// const buses = require("./data/buses")

const connectDB = require('./config/db');

dotenv.config()

connectDB()

// import data => node importData.js -i
const importData = async () => {
  try {
    await House.deleteMany()
    await Owner.deleteMany()

    // await Driver.deleteMany()

    // await Bus.deleteMany()

    // import houses
    const sampleHouses = houses.map((house) => {
      return { ...house }
    })

    await House.insertMany(sampleHouses)


    // import owners
    const sampleOwners = owners.map((owner) => {
      return { ...owner }
    })

    await Owner.insertMany(sampleOwners)



    // import drivers
    // const sampleDriver = drivers.map((driver) => {
    //   return { ...driver }
    // })

    // await Driver.insertMany(sampleDriver)


    // import buses
    // const sampleBus = buses.map((bus) => {
    //   return { ...bus }
    // })

    // await Bus.insertMany(sampleBus)


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
    await House.deleteMany()
    await Owner.deleteMany()

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