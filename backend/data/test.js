const mongoose = require('mongoose');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// Provided lists for House fields
const houseTypes = [
  "مسکونی", "تجاری", "اداری", "صنعتی", "کشاورزی", "ویلا", "زمین", "باغ", "انبار", "مغازه",
  "آپارتمان", "پنت‌هاوس", "دوبلکس", "سوییت", "هتل", "کلینیک", "کلبه", "اتاق", "قدیمی",
  "نوساز", "بازسازی", "دامداری / مرغداری", "سایر"
];

const enviornmentList = [
  "کوهستانی", "جنگلی", "دریا", "ساحلی", "بیابانی", "حیات وحش", "بوم گردی", "باستانی تاریخی",
  "مرکز شهر", "روستایی", "سایر"
];

const provinces = [
  "آذربایجان شرقی", "آذربايجان غربی", "اردبيل", "اصفهان", "البرز", "ايلام", "بوشهر", "تهران",
  "چهارمحال و بختياری", "خراسان جنوبی", "خراسان رضوی", "خراسان شمالی", "خوزستان", "زنجان",
  "سمنان", "سيستان و بلوچستان", "فارس", "قزوين", "قم", "کردستان", "کرمان", "کرمانشاه",
  "کهکيلويه و بويراحمد", "گلستان", "گيلان", "لرستان", "مازندران", "مرکزی", "هرمزگان", "همدان", "يزد"
];

const cities = [
  "تهران", "مشهد", "اصفهان", "کرج", "شيراز", "تبريز", "قم", "اهواز", "کرمانشاه", "اروميه",
  "رشت", "زاهدان", "همدان", "کرمان", "يزد", "اردبيل", "بندرعباس", "اراک", "زنجان", "سنندج",
  "قزوين", "خرم آباد", "گرگان", "ساری", "بجنورد", "بوشهر", "بيرجند", "ايلام", "شهرکرد", "ياسوج", "سمنان"
];

// Define Owner schema (as provided)
const ownerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "نام و نام خانوادگی ملک دار باید وارد شود"],
    trim: true,
    min: 6,
    max: 50
  },
  username: {
    type: String,
    trim: true,
    required: [true, " نام کاربری ملک دار باید وارد شود"],
    min: 3,
    max: 20
  },
  nationalCode: {
    type: String,
    trim: true,
    min: 10,
    max: 10
  },
  gender: {
    type: String,
  },
  city: {
    type: String,
  },
  province: {
    type: String,
  },
  email: {
    type: String,
    lowercase: true,
    validate: [validator.isEmail, 'لطفا یک ایمیل معتبر وارد کنید']
  },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /09\d{9}/.test(v);
      },
      message: (props) => `${props.value} یک شماره تلفن معتبر نیست!`,
    },
    required: [true, "شماره همراه ملک دار باید وارد شود"],
    unique: true,
  },
  avatar: {
    type: String,
    default: 'default.jpg'
  },
  role: {
    type: String,
    default: 'owner'
  },
  password: {
    type: String,
    required: [true, 'گذرواژه باید وارد شود'],
    minlength: 8,
  },
  token: {
    type: String,
  },
  address: {
    type: String,
    default: ""
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  isActive: {
    type: Boolean,
    default: true,
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'House',
    }
  ],
}, { timestamps: true });

ownerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

ownerSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

ownerSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const Owner = mongoose.model('Owner', ownerSchema);

// Define House schema (as provided)
const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const houseSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "Owner",
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Please tell house name!"],
      trim: true,
      maxlength: [25, "A house name must have less or equal then 25 characters"],
      minlength: [6, "A house name must have more or equal then 6 characters"],
      unique: true,
    },
    houseOwner: {
      type: String,
      required: [true, "Please tell house owner name!"],
      trim: true,
      maxlength: [25, "A house owner name must have less or equal then 25 characters"],
      minlength: [6, "A house owner name must have more or equal then 6 characters"],
      unique: true,
    },
    province: {
      type: String,
      trim: true,
      required: true,
    },
    city: {
      type: String,
      trim: true,
      required: true,
    },
    postalCode: {
      type: String,
    },
    housePhone: {
      type: String,
    },
    meters: {
      type: Number,
    },
    description: {
      type: String,
    },
    year: {
      type: Number,
    },
    capacity: {
      type: Number,
      default: 1,
    },
    startDay: {
      type: Date,
    },
    endDay: {
      type: Date,
    },
    cover: {
      type: String,
    },
    images: [{ type: String }],
    houseRoles: [{ type: String }],
    critrias: [{ type: String }],
    houseType: {
      type: String,
    },
    checkIn: Number,
    checkOut: Number,
    lat: {
      type: Number,
      default: 0,
    },
    lng: {
      type: Number,
      default: 0,
    },
    floor: {
      type: Number,
      default: 0,
    },
    options: [{ type: String }],
    heating: [{ type: String }],
    cooling: [{ type: String }],
    parking: {
      type: Number,
      default: 0,
    },
    bill: [{ type: String }],
    price: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
    },
    houseNumber: {
      type: String,
    },
    hobbies: [{ type: String }],
    reservationRoles: [{ type: String }],
    enviornment: {
      type: [String],
      default: [],
    },
    ownerType: {
      type: String,
    },
    rooms: {
      type: String,
    },
    freeDates: [{ type: String }],
    document: [{ type: String }],
    floorType: [{ type: String }],
    kitchenOptions: [{ type: String }],
    bedRoomOptions: [{ type: String }],
    discount: {
      type: Number,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
      required: true,
    },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

const House = mongoose.model("House", houseSchema);

// Cache for Unsplash images
const imageCache = [];

// Function to get a random house image from Unsplash with retry logic
async function getRandomHouseImage(retries = 3, delayMs = 1000) {
  // Check cache first
  if (imageCache.length > 0) {
    return imageCache[Math.floor(Math.random() * imageCache.length)];
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const accessKey = 'YOUR_UNSPLASH_ACCESS_KEY'; // Replace with your Unsplash Access Key
      const response = await axios.get('https://api.unsplash.com/search/photos?query=house&per_page=30', {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
        timeout: 10000, // 10-second timeout
      });

      const photos = response.data.results;
      if (photos.length === 0) {
        throw new Error('No house images found');
      }

      const randomIndex = Math.floor(Math.random() * photos.length);
      const imageUrl = photos[randomIndex].urls.regular;
      imageCache.push(imageUrl); // Cache the image
      return imageUrl;
    } catch (error) {
      console.error(`Attempt ${attempt} failed: ${error.message}`);
      if (attempt === retries) {
        console.error('All retries failed, using fallback image');
        return 'https://via.placeholder.com/800x600.png?text=House+Image+Not+Found';
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}

// Helper function to generate random Iranian phone number
function getRandomPhone(index) {
  const prefixes = ['0912', '0935', '0919', '0936', '0910'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  // Use index to reduce collision risk
  const digits = (1000000 + index * 12345 + Math.floor(Math.random() * 10000)).toString().slice(0, 7);
  return prefix + digits;
}

// Helper function to generate random Iranian national code (10 digits)
function getRandomNationalCode(index) {
  return (1000000000 + index * 54321 + Math.floor(Math.random() * 100000)).toString().slice(0, 10);
}

// Helper function to generate unique random string for unique fields
function getRandomString(length) {
  return Math.random().toString(36).substring(2, 2 + length);
}

// Helper function to generate random owner data
function generateOwnerData(index) {
  const firstNames = ['علی', 'زهرا', 'محمد', 'فاطمه', 'حسین', 'مریم', 'رضا', 'نرگس'];
  const lastNames = ['رضایی', 'محمدی', 'حسینی', 'علیزاده', 'کریمی', 'رحیمی', 'نوری', 'صادقی'];

  const username = `owner${index}${getRandomString(4)}`;
  const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  const provinceIndex = Math.floor(Math.random() * provinces.length);
  return {
    name,
    username,
    nationalCode: getRandomNationalCode(index),
    gender: ['مرد', 'زن'][Math.floor(Math.random() * 2)],
    city: cities[provinceIndex % cities.length], // Ensure city is valid for province
    province: provinces[provinceIndex],
    email: `${username}@example.com`,
    phone: getRandomPhone(index),
    password: 'password123',
    address: `خیابان نمونه، پلاک ${Math.floor(Math.random() * 100)}`,
  };
}

// Helper function to generate random house data
async function generateHouseData(index, owner) {
  const coverImage = await getRandomHouseImage();
  const provinceIndex = Math.floor(Math.random() * provinces.length);
  const city = cities[provinceIndex % cities.length]; // Ensure city is valid for province

  // Generate unique name and houseOwner
  const uniqueSuffix = getRandomString(5);
  const name = `خانه نمونه ${index + 1} ${uniqueSuffix}`.slice(0, 25);
  const houseOwner = `${owner.name} ${uniqueSuffix}`.slice(0, 25);

  // Add delay to avoid rate limiting
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    owner: owner._id,
    name,
    houseOwner,
    province: provinces[provinceIndex],
    city,
    postalCode: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
    housePhone: getRandomPhone(index),
    meters: Math.floor(Math.random() * 300) + 50, // 50 to 350 sqm
    description: `یک خانه زیبا با امکانات مدرن، شماره ${index + 1}. مجهز به سیستم گرمایش و سرمایش مرکزی.`,
    year: Math.floor(Math.random() * 30) + 1995, // 1995 to 2024
    capacity: Math.floor(Math.random() * 6) + 1, // 1 to 6
    startDay: new Date(2025, 0, 1),
    endDay: new Date(2025, 11, 31),
    cover: coverImage,
    images: [coverImage, 'https://via.placeholder.com/800x600.png?text=Image+2'],
    houseRoles: ['بدون حیوان خانگی', 'ممنوعیت سیگار'],
    critrias: ['مناسب خانواده', 'نزدیک به مرکز شهر'],
    houseType: houseTypes[Math.floor(Math.random() * houseTypes.length)],
    checkIn: 14, // 2 PM
    checkOut: 12, // 12 PM
    lat: Math.random() * 0.1 + 35.6892, // Near Tehran coordinates
    lng: Math.random() * 0.1 + 51.3890,
    floor: Math.floor(Math.random() * 10), // 0 to 9
    options: ['وای‌فای', 'تلویزیون'],
    heating: ['بخاری گازی', 'شوفاژ'],
    cooling: ['کولر آبی', 'کولر گازی'],
    parking: Math.floor(Math.random() * 3), // 0 to 2
    bill: ['برق', 'آب', 'گاز'],
    price: Math.floor(Math.random() * 5000000000) + 100000000, // 100M to 5.1B IRR
    address: `خیابان نمونه، کوچه ${index + 1}، پلاک ${Math.floor(Math.random() * 100)}`,
    houseNumber: `H${index + 1}`,
    hobbies: ['پیاده‌روی', 'تماشای فیلم'],
    reservationRoles: ['رزرو حداقل 2 روز', 'لغو تا 48 ساعت قبل'],
    enviornment: [enviornmentList[Math.floor(Math.random() * enviornmentList.length)]],
    ownerType: 'شخصی',
    rooms: `${Math.floor(Math.random() * 4) + 1} خوابه`, // 1 to 4 bedrooms
    freeDates: ['1404/01/01', '1404/01/02'],
    document: ['سند ملکی'],
    floorType: ['سرامیک', 'پارکت'],
    kitchenOptions: ['یخچال', 'اجاق گاز'],
    bedRoomOptions: ['تخت دونفره', 'کمد'],
    discount: Math.floor(Math.random() * 20) + 1, // 1 to 20%
    isActive: true,
    isAvailable: true,
    reviews: [],
  };
}

// Seeder function
async function seedHouses(numberOfOwners = 5, numberOfHouses = 10) {
  try {
    // Connect to MongoDB (replace with your database connection string)
    await mongoose.connect('mongodb://localhost:27017/your_database', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing owners and houses
    await Owner.deleteMany({});
    await House.deleteMany({});
    console.log('Cleared existing owners and houses');

    // Step 1: Create and save owners
    const owners = [];
    for (let i = 0; i < numberOfOwners; i++) {
      const ownerData = generateOwnerData(i);
      owners.push(ownerData);
    }
    const savedOwners = await Owner.insertMany(owners);
    console.log(`Seeded ${numberOfOwners} owners`);

    // Step 2: Create houses with owner IDs
    const houses = [];
    for (let i = 0; i < numberOfHouses; i++) {
      const randomOwner = savedOwners[Math.floor(Math.random() * savedOwners.length)];
      const houseData = await generateHouseData(i, randomOwner);
      houses.push(houseData);
    }

    await House.insertMany(houses);
    console.log(`Seeded ${numberOfHouses} houses`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding data:', error.message);
    await mongoose.disconnect();
  }
}

// Run the seeder
seedHouses(20, 20).catch((err) => console.error('Seeder failed:', err.message));