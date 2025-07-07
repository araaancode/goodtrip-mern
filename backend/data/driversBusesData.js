const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongoose").Types;
const moment = require("moment-jalaali");

// Initialize moment-jalaali with Persian digits
moment.loadPersian({ usePersianDigits: false });

// ******************************** **** ********************************
// ******************************** Vars ********************************
// ******************************** **** ********************************

const busImages = [
  "https://portal.bazargah.com/UploadFiles/Editor/man.jpg",
  "https://portal.bazargah.com/UploadFiles/Editor/volvo.jpg",
  "https://portal.bazargah.com/UploadFiles/Editor/skania.jpg",
  "https://portal.bazargah.com/UploadFiles/Editor/b12.jpg",
  "https://portal.bazargah.com/UploadFiles/Editor/maral.jpg",
  "https://api2.kojaro.com/media/2023-8-495faf4e-f5d4-49df-aaf9-0909adc86ca4-67c46115c1067c5ba76862c6?w=828&q=80",
  "https://plus.unsplash.com/premium_photo-1664302152991-d013ff125f3f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnVzfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVzfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1564694202883-46e7448c1b26?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YnVzfGVufDB8fDB8fHww",
  "https://plus.unsplash.com/premium_photo-1661963542752-9a8a1d72fb28?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YnVzfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnVzfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1632276536839-84cad7fd03b0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YnVzfGVufDB8fDB8fHww",
  "https://plus.unsplash.com/premium_photo-1661963208071-9a65b048ebaf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YnVzfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1570118054363-ff4d296962f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJ1c3xlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1590951360207-317cb18098b3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGJ1c3xlbnwwfHwwfHx8MA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1676573201639-79bb6d344ffd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGJ1c3xlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1571046314604-e32adfc8e11e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGJ1c3xlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1525962898597-a4ae6402826e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fGJ1c3xlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1561579680-7ee92bef4298?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fGJ1c3xlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1607424064879-708250e57647?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGJ1c3xlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1577459640575-219cbf231b8b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGJ1c3xlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1570566044244-65ae0dfd98d6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGJ1c3xlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1590922144791-347af7dd9dd1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGJ1c3xlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1573812456956-4a85dfc2ed00?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fGJ1c3xlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1544190312-44b545e98ef0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGJ1c3xlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1605068263928-dc295689add1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fGJ1c3xlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1605068263928-dc295689add1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fGJ1c3xlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1495150434753-f8ceb319e9dc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTR8fGJ1c3xlbnwwfHwwfHx8MA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1676795223467-dad25a1e12d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fGJ1c3xlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1558494390-6178bc5799e6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDl8fGJ1c3xlbnwwfHwwfHx8MA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1661916408325-5280388bf1e3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fGJ1c3xlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1708864141190-8a0d14610f80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTl8fGJ1c3xlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1685470883352-ba1ea87c937d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTN8fGJ1c3xlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1589395241612-86d52ec4b9f4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGJ1c3xlbnwwfHwwfHx8MA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1676573201135-f244eda6a220?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fGJ1c3xlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1610290621034-3e4754ada6ca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzB8fGJ1c3xlbnwwfHwwfHx8MA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1670491584909-fad9d3a4f66d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fGJ1c3xlbnwwfHwwfHx8MA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1677419807538-4438f71414e5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fGJ1c3xlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1604050926948-c9949b62e11e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjV8fGJ1c3xlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1618805154647-7d89ac05926b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzF8fGJ1c3xlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1546955870-9fc9e5534349?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzh8fGJ1c3xlbnwwfHwwfHx8MA%3D%3D",
];

const persianNames = [
  "علی محمدی",
  "زهرا حسینی",
  "محمد رضایی",
  "فاطمه احمدی",
  "حسن کاظمی",
];

const modelsList = [
  "بنز O457",
  "بنز O500",
  "بنز Travego",
  "سورتمه",
  "اسکانیا مارال",
  "اسکانیا درسا",
  "اسکانیا پارسا",
  "ولوو B12",
  "ولوو B9R",
  "شهاب مان R07",
  "شهاب مان R08",
  "آکیا 302",
  "آکیا جدید شهری و بین‌شهری",
  "سایر",
];

const busNames = [
  { name: "اسکانیا مارال" },
  { name: "ولوو B9" },
  { name: "ولوو B7" },
  { name: "مان Lion's Coach" },
  { name: "بنز Travego" },
  { name: "بنز O302" },
  { name: "یوتانگ" },
  { name: "هاگر" },
  { name: "درسا" },
  { name: "مارال VIP" },
  { name: "مان الایت" },
  { name: "ایسوزو" },
  { name: "فوتون" },
  { name: "شهاب" },
  { name: "آذرخش" }
];

const colors = [
  "قرمز",
  "سبز",
  "آبی",
  "زرد",
  "نارنجی",
  "بنفش",
  "صورتی",
  "قهوه‌ای",
  "مشکی",
  "سفید",
  "خاکستری",
  "لاجوردی",
  "فیروزه‌ای",
  "زیتونی",
  "آبی نفتی",
  "سرمه‌ای",
  "طلایی",
  "نقره‌ای",
  "یاسی",
  "گلبهی",
];

const typesList = [
  "اسکانیا",
  "ولوو",
  "مان",
  "مرسدس بنز",
  "ایران خودرو دیزل",
  "هیوندا",
  "آکیا",
  "سایر",
];

const busTypesList = [
  "VIP",
  "لوکس",
  "معمولی",
];

const busServiceProviders = [
  "رویال سفر ایرانیان",
  "ایران پیما",
  "پیک صبا",
  "آسیا سفر",
  "سفر سیر آریا",
  "تک سفر ایرانیان",
  "همسفر",
  "ماهان سفر",
  "میهن نور",
  "عدالت سیر",
  "لوان نور",
  "گیتی نورد",
  "سیر و سفر",
  "آسیا سیر اصفهان",
  "سفرهای طلایی",
];

const optionsList = [
  "پرده‌های پنجره",
  "سیستم صوتی و تصویری",
  "وای‌فای",
  "پریز برق یا پورت USB",
  "یخچال کوچک",
  "پذیرایی",
  "کمربند ایمنی برای هر صندلی",
  "دوربین مداربسته",
  "کپسول آتش‌نشانی و چکش اضطراری",
  "GPS و سیستم مانیتورینگ راننده",
  "سایر",
];

const heatList = [
  "بخاری آبگرم",
  "بخاری برقی",
  "بخاری گازی",
  "بخاری دیزلی",
  "سیستم گرمایشی مبتنی بر تهویه مطبوع",
  "بخاری مستقل",
  "ندارد",
  "سایر",
];

const coldnessList = [
  "سیستم تهویه مطبوع",
  "چیلر اتوبوس",
  "کولر گازی سقفی",
  "پنکه یا فن تهویه",
  "پنجره‌های تهویه‌ای",
  "سیستم سرمایشی مبتنی بر آب",
  "کولر گازی کمکی",
  "ندارد",
  "سایر",
];

// ******************************** ********* ********************************
// ******************************** Functions ********************************
// ******************************** ********* ********************************

function formatJalaliDate(date, includeTime = false) {
  return includeTime 
    ? moment(date).format("jYYYY/jMM/jDD HH:mm:ss")
    : moment(date).format("jYYYY/jMM/jDD");
}

function createRandomDate() {
  const tomorrow = moment().add(1, "day");
  const oneYearLater = moment().add(1, "year");
  const totalDays = oneYearLater.diff(tomorrow, "days");
  const randomOffset = Math.floor(Math.random() * (totalDays + 1));
  const randomDate = tomorrow.clone().add(randomOffset, "days");
  return formatJalaliDate(randomDate);
}

function generateRandomHour() {
  const hour = Math.floor(Math.random() * 24);
  return hour.toString().padStart(2, "0");
}

function generateRandomDateofIssue() {
  const today = moment();
  const minDate = moment().subtract(18, "years");
  const totalDays = today.diff(minDate, "days");
  const randomOffset = Math.floor(Math.random() * totalDays);
  const randomDate = minDate.add(randomOffset, "days");
  return formatJalaliDate(randomDate);
}

function generateRandomBirthDate() {
  const maxDate = moment().subtract(18, "years");
  const minDate = moment().subtract(90, "years");
  const totalDays = maxDate.diff(minDate, "days");
  const randomOffset = Math.floor(Math.random() * totalDays);
  const randomDate = minDate.add(randomOffset, "days");
  return formatJalaliDate(randomDate);
}

function generateRandomDrivingLicense() {
  const provinceCode = String(Math.floor(Math.random() * 31) + 1).padStart(2, "0");
  const uniqueNumber = String(Math.floor(Math.random() * 1e8)).padStart(8, "0");
  return `1${provinceCode}${uniqueNumber}`;
}

function generateRandomCrediteDate() {
  const today = moment();
  const maxDate = moment().add(10, "years");
  const totalDays = maxDate.diff(today, "days");
  const randomOffset = Math.floor(Math.random() * totalDays);
  const expiryDate = today.clone().add(randomOffset, "days");
  return formatJalaliDate(expiryDate);
}

function returnRandomItemFromArray(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function generateRandomBusLicensePlate() {
  const numbers = () => String(Math.floor(Math.random() * 90) + 10);
  const letters = ["ع", "ب", "ت", "س"];
  const cityCodes = [11, 21, 22, 13, 31, 17, 15, 45];
  const part1 = numbers();
  const letter = letters[Math.floor(Math.random() * letters.length)];
  const part2 = numbers();
  const city = cityCodes[Math.floor(Math.random() * cityCodes.length)];
  return `${part1} ${letter} ${part2} - ایران ${city}`;
}

function generateDriver(index) {
  const hashedPassword = bcrypt.hashSync("12345678", 12);
  const cities = [
    "آذربایجان شرقی", "آذربایجان غربی", "اردبیل", "اصفهان", "البرز", 
    "ایلام", "بوشهر", "تهران", "چهارمحال و بختیاری", "خراسان جنوبی", 
    "خراسان رضوی", "خراسان شمالی", "خوزستان", "زنجان", "سمنان", 
    "سیستان و بلوچستان", "فارس", "قزوین", "قم", "کردستان", 
    "کرمان", "کرمانشاه", "کهگیلویه و بویراحمد", "گلستان", "گیلان", 
    "لرستان", "مازندران", "مرکزی", "هرمزگان", "همدان", "یزد"
  ];
  
  // Get two different cities
  let firstCityIndex = index % cities.length;
  let lastCityIndex = (index + 1 + Math.floor(Math.random() * (cities.length - 1))) % cities.length;
  
  // Ensure they're different
  while (lastCityIndex === firstCityIndex) {
    lastCityIndex = (lastCityIndex + 1) % cities.length;
  }

  return {
    _id: new ObjectId().toString(),
    name: persianNames[index % persianNames.length],
    username: `bus${index + 1}`,
    password: hashedPassword,
    nationalCode: (1000000000 + index).toString().padStart(10, "0"),
    gender: index % 2 === 0 ? "مرد" : "زن",
    city: cities[index % 3],
    province: cities[index % 3],
    email: `bus${index + 1}@example.com`,
    phone: `09${(100000000 + index).toString().padStart(9, "0")}`,
    firstCity: cities[firstCityIndex],
    lastCity: cities[lastCityIndex],
    movingDate: createRandomDate(),
    returningDate: createRandomDate(),
    startHour: generateRandomHour(),
    endHour: generateRandomHour(),
    address: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است",
    drivingLicense: {
      name: persianNames[index % persianNames.length],
      nationalCode: (1000000000 + index).toString().padStart(10, "0"),
      dateOfIssue: generateRandomDateofIssue(),
      birthDate: generateRandomBirthDate(),
      licenseNumber: generateRandomDrivingLicense(),
      crediteDate: generateRandomCrediteDate(),
    },
    isActive: true,
    createdAt: formatJalaliDate(new Date(), true),
    updatedAt: formatJalaliDate(new Date(), true),
  };
}

function generateBus(index, driver) {
  const busTemplate = busNames[index % busNames.length];
  return {
    _id: new ObjectId().toString(),
    driver: driver._id,
    name: busTemplate.name,
    description: `توضیحات ${busTemplate.name} توسط ${driver.name}`,
    model: returnRandomItemFromArray(modelsList),
    color: returnRandomItemFromArray(colors),
    type: returnRandomItemFromArray(typesList),
    licensePlate: generateRandomBusLicensePlate(),
    serviceProvider: returnRandomItemFromArray(busServiceProviders),
    price: 50000 + (index % 50) * 10000,
    photo: `${returnRandomItemFromArray(busImages)}`,
    photos: [
      `${returnRandomItemFromArray(busImages)}`,
      `${returnRandomItemFromArray(busImages)}`,
      `${returnRandomItemFromArray(busImages)}`,
      `${returnRandomItemFromArray(busImages)}`,
      `${returnRandomItemFromArray(busImages)}`,
      `${returnRandomItemFromArray(busImages)}`,
    ],
    options: returnRandomItemFromArray(optionsList),
    heat: returnRandomItemFromArray(heatList),
    coldness: returnRandomItemFromArray(coldnessList),
    isActive: true,
    isAvailable: true,
    createdAt: formatJalaliDate(new Date(), true),
    updatedAt: formatJalaliDate(new Date(), true),
  };
}

const drivers = Array.from({ length: 350 }, (_, index) => generateDriver(index));
const buses = drivers.flatMap((driver, index) =>
  Array.from({ length: 3 }, (_, i) => generateBus(index * 3 + i, driver))
);

module.exports = { drivers, buses };