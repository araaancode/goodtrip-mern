const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongoose').Types;

// Lists for realistic Persian data
const persianNames = [
  'علی محمدی', 'زهرا حسینی', 'محمد رضایی', 'فاطمه احمدی', 'حسن کاظمی',
  'مریم علوی', 'رضا نوری', 'نرگس رحیمی', 'امیر حسنی', 'سارا کریمی'
];
const provinces = ['تهران', 'اصفهان', 'فارس', 'خوزستان', 'مازندران', 'آذربایجان شرقی', 'کرمان', 'گیلان', 'البرز', 'قم'];
const cities = [
  'تهران', 'اصفهان', 'شیراز', 'اهواز', 'ساری', 'تبریز', 'کرمان', 'رشت', 'کرج', 'قم',
  'مشهد', 'یزد', 'قزوین', 'اراک', 'همدان', 'کاشان', 'اردبیل', 'زنجان', 'بندرعباس', 'سنندج'
];
const houseTypes = ['آپارتمان', 'ویلا', 'خانه'];
const environmentTypes = ['شهری', 'روستایی', 'حومه شهر'];

// Function to generate a random 10-digit national code
function generateNationalCode(index) {
  return (1000000000 + index).toString().padStart(10, '0');
}

// Function to generate a random 11-digit phone number starting with '09'
function generatePhoneNumber(index) {
  return '09' + (100000000 + index).toString().padStart(9, '0');
}

// Function to generate a single owner sample
function generateOwner(index) {
  const hashedPassword = bcrypt.hashSync('12345678', 12); // Hash password with cost of 12
  const nameIndex = index % persianNames.length;
  const provinceIndex = index % provinces.length;
  const cityIndex = index % cities.length;

  return {
    _id: new ObjectId().toString(), // Simulate ObjectId as string
    name: persianNames[nameIndex] + (index >= persianNames.length ? ` ${index + 1}` : ''),
    username: `user${index + 1}`,
    nationalCode: generateNationalCode(index),
    gender: index % 2 === 0 ? 'مرد' : 'زن',
    city: cities[cityIndex],
    province: provinces[provinceIndex],
    email: `owner${index + 1}@example.com`,
    phone: generatePhoneNumber(index),
    avatar: 'default.jpg',
    role: 'owner',
    password: hashedPassword,
    token: undefined,
    address: `خیابان نمونه ${index + 1}، ${cities[cityIndex]}`,
    passwordChangedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (index % 30)),
    passwordResetToken: undefined,
    passwordResetExpires: undefined,
    isActive: true,
    favorites: [],
    createdAt: new Date(),
    updatedAt: new Date()
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
    postalCode: `12345${index.toString().padStart(5, '0')}`,
    housePhone: generatePhoneNumber(index + 100), // Unique phone, offset to avoid Owner phone conflict
    meters: 50 + (index % 151), // 50-200 square meters
    description: `یک خانه زیبا و راحت در ${cities[cityIndex]}`,
    year: 1380 + (index % 20), // 1380-1399 (Persian calendar years)
    capacity: 1 + (index % 5), // 1-5 people
    startDay: new Date(2025, 5, 1), // June 1, 2025
    endDay: new Date(2025, 11, 31), // Dec 31, 2025
    cover: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aG91c2V8ZW58MHx8MHx8fDA%3D',
    images: [
        'https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG91c2V8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2V8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG91c2V8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1494526585095-c41746248156?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhvdXNlfGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGhvdXNlfGVufDB8fDB8fHww',
        'https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG91c2V8ZW58MHx8MHx8fDA%3D',
    ],
    houseRoles: ['بدون سیگار', 'مناسب خانواده'],
    critrias: ['حداقل اقامت ۲ شب'],
    houseType: houseTypes[index % houseTypes.length],
    checkIn: 14, // 2 PM
    checkOut: 12, // 12 PM
    lat: 35.6892 + (index % 10) * 0.01, // Approximate coordinates
    lng: 51.3890 + (index % 10) * 0.01,
    floor: index % 5, // 0-4 floors
    options: ['وای‌فای', 'تلویزیون'],
    heating: ['بخاری گازی'],
    cooling: ['کولر آبی'],
    parking: index % 3, // 0-2 parking spaces
    bill: ['آب', 'برق'],
    price: 1000000 + (index % 100) * 10000, // 1M-2M IRR
    address: `خیابان خانه ${index + 1}، ${cities[cityIndex]}`,
    houseNumber: `H${index + 1}`,
    hobbies: ['پیاده‌روی', 'کتاب‌خوانی'],
    reservationRoles: ['رزرو حداقل ۴۸ ساعت قبل'],
    enviornment: [environmentTypes[index % environmentTypes.length]],
    ownerType: 'مالک خصوصی',
    rooms: `${1 + (index % 3)} خوابه`, // 1-3 bedrooms
    freeDates: ['1404/03/01', '1404/03/02'], // Persian calendar dates
    document: ['سند مالکیت'],
    floorType: ['سرامیک'],
    kitchenOptions: ['اجاق گاز', 'یخچال'],
    bedRoomOptions: ['تخت دو نفره'],
    discount: 1 + (index % 10), // 1-10% discount
    isActive: true,
    isAvailable: true,
    reviews: [], // Empty reviews array
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

// Generate 100 owner samples
const owners = Array.from({ length: 100 }, (_, index) => generateOwner(index));

// Generate 100 house samples, each linked to an owner
const houses = owners.map((owner, index) => generateHouse(index, owner));

module.exports = { owners, houses };