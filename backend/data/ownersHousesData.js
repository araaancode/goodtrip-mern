const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongoose").Types;

// Lists for realistic Persian data
const persianNames = [
  "علی محمدی",
  "زهرا حسینی",
  "محمد رضایی",
  "فاطمه احمدی",
  "حسن کاظمی",
  "مریم علوی",
  "رضا نوری",
  "نرگس رحیمی",
  "امیر حسنی",
  "سارا کریمی",
];
const houseTypes = [
  "مسکونی",
  "تجاری",
  "اداری",
  "صنعتی",
  "کشاورزی",
  "ویلا",
  "زمین",
  "باغ",
  "انبار",
  "مغازه",
  "آپارتمان",
  "پنت‌هاوس",
  "دوبلکس",
  "سوییت",
  "هتل",
  "کلینیک",
  "کلبه",
  "اتاق",
  "قدیمی",
  "نوساز",
  "بازسازی",
  "دامداری / مرغداری",
  "سایر",
];

const environmentTypes = [
  "کوهستانی",
  "جنگلی",
  "دریا",
  "ساحلی",
  "بیابانی",
  "حیات وحش",
  "بوم گردی",
  "باستانی تاریخی",
  "مرکز شهر",
  "روستایی",
  "سایر",
];

const provinces = [
  "آذربایجان شرقی",
  "آذربايجان غربی",
  "اردبيل",
  "اصفهان",
  "البرز",
  "ايلام",
  "بوشهر",
  "تهران",
  "چهارمحال و بختياری",
  "خراسان جنوبی",
  "خراسان رضوی",
  "خراسان شمالی",
  "خوزستان",
  "زنجان",
  "سمنان",
  "سيستان و بلوچستان",
  "فارس",
  "قزوين",
  "قم",
  "کردستان",
  "کرمان",
  "کرمانشاه",
  "کهکيلويه و بويراحمد",
  "گلستان",
  "گيلان",
  "لرستان",
  "مازندران",
  "مرکزی",
  "هرمزگان",
  "همدان",
  "يزد",
];

const cities = [
  "تهران",
  "مشهد",
  "اصفهان",
  "کرج",
  "شيراز",
  "تبريز",
  "قم",
  "اهواز",
  "کرمانشاه",
  "اروميه",
  "رشت",
  "زاهدان",
  "همدان",
  "کرمان",
  "يزد",
  "اردبيل",
  "بندرعباس",
  "اراک",
  "زنجان",
  "سنندج",
  "قزوين",
  "خرم آباد",
  "گرگان",
  "ساری",
  "بجنورد",
  "بوشهر",
  "بيرجند",
  "ايلام",
  "شهرکرد",
  "ياسوج",
  "سمنان",
];

const houseImages = [
  "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
  "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600",
  "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=600",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600",
  "https://images.unsplash.com/photo-1600566752227-513c6e7e684f?w=600",
  "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=600",
  "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600",
  "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600",
  "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=600",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600",
  "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=600",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600",
  "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=600",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600",
];

// Function to generate a random 10-digit national code
function generateNationalCode(index) {
  return (1000000000 + index).toString().padStart(10, "0");
}

// Function to generate a random 11-digit phone number starting with '09'
function generatePhoneNumber(index) {
  return "09" + (100000000 + index).toString().padStart(9, "0");
}


// return random house image
function getRandomHouseImage(array) {
    // Generate a random index between 0 and array.length - 1
    const randomIndex = Math.floor(Math.random() * array.length);
    // Return the item at the random index
    return array[randomIndex];
}
  


// Function to generate a single owner sample
function generateOwner(index) {
  const hashedPassword = bcrypt.hashSync("12345678", 12); // Hash password with cost of 12
  const nameIndex = index % persianNames.length;
  const provinceIndex = index % provinces.length;
  const cityIndex = index % cities.length;

  return {
    _id: new ObjectId().toString(), // Simulate ObjectId as string
    name:
      persianNames[nameIndex] +
      (index >= persianNames.length ? ` ${index + 1}` : ""),
    username: `user${index + 1}`,
    nationalCode: generateNationalCode(index),
    gender: index % 2 === 0 ? "مرد" : "زن",
    city: cities[cityIndex],
    province: provinces[provinceIndex],
    email: `owner${index + 1}@example.com`,
    phone: generatePhoneNumber(index),
    avatar: "default.jpg",
    role: "owner",
    password: hashedPassword,
    token: undefined,
    address: `خیابان نمونه ${index + 1}، ${cities[cityIndex]}`,
    passwordChangedAt: new Date(
      Date.now() - 1000 * 60 * 60 * 24 * (index % 30)
    ),
    passwordResetToken: undefined,
    passwordResetExpires: undefined,
    isActive: true,
    favorites: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}



// Function to generate a single house sample
function generateHouse(index, owner) {
  const cityIndex = index % cities.length;
  const provinceIndex = index % provinces.length;

  return {
    owner: owner._id, // Link to Owner's _id
    user: undefined, // Optional field, left undefined
    name: `خانه نمونه ${index + 1}`,
    houseOwner: owner.name, // Match Owner's name
    province: provinces[provinceIndex],
    city: cities[cityIndex],
    postalCode: `12345${index.toString().padStart(5, "0")}`,
    housePhone: generatePhoneNumber(index + 100), // Unique phone, offset to avoid Owner phone conflict
    meters: 50 + (index % 151), // 50-200 square meters
    description: `یک خانه زیبا و راحت در ${cities[cityIndex]}`,
    year: 1380 + (index % 20), // 1380-1399 (Persian calendar years)
    capacity: 1 + (index % 5), // 1-5 people
    startDay: new Date(2025, 5, 1), // June 1, 2025
    endDay: new Date(2025, 11, 31), // Dec 31, 2025
    cover: getRandomHouseImage(houseImages),
    images: [
        getRandomHouseImage(houseImages),
        getRandomHouseImage(houseImages),
        getRandomHouseImage(houseImages),
        getRandomHouseImage(houseImages),
        getRandomHouseImage(houseImages),
        getRandomHouseImage(houseImages)
    ],
    houseRoles: ["بدون سیگار", "مناسب خانواده"],
    critrias: ["حداقل اقامت ۲ شب"],
    houseType: houseTypes[index % houseTypes.length],
    checkIn: 14, // 2 PM
    checkOut: 12, // 12 PM
    lat: 35.6892 + (index % 10) * 0.01, // Approximate coordinates
    lng: 51.389 + (index % 10) * 0.01,
    floor: index % 5, // 0-4 floors
    options: ["وای‌فای", "تلویزیون"],
    heating: ["بخاری گازی"],
    cooling: ["کولر آبی"],
    parking: index % 3, // 0-2 parking spaces
    bill: ["آب", "برق"],
    price: 1000000 + (index % 100) * 10000, // 1M-2M IRR
    address: `خیابان خانه ${index + 1}، ${cities[cityIndex]}`,
    houseNumber: `H${index + 1}`,
    hobbies: ["پیاده‌روی", "کتاب‌خوانی"],
    reservationRoles: ["رزرو حداقل ۴۸ ساعت قبل"],
    enviornment: [environmentTypes[index % environmentTypes.length]],
    ownerType: "مالک خصوصی",
    rooms: `${1 + (index % 3)} خوابه`, // 1-3 bedrooms
    freeDates: ["1404/03/01", "1404/03/02"], // Persian calendar dates
    document: ["سند مالکیت"],
    floorType: ["سرامیک"],
    kitchenOptions: ["اجاق گاز", "یخچال"],
    bedRoomOptions: ["تخت دو نفره"],
    discount: 1 + (index % 10), // 1-10% discount
    isActive: true,
    isAvailable: true,
    reviews: [], // Empty reviews array
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Generate 100 owner samples
const owners = Array.from({ length: 100 }, (_, index) => generateOwner(index));

// Generate 100 house samples, each linked to an owner
const houses = owners.map((owner, index) => generateHouse(index, owner));

module.exports = { owners, houses };
