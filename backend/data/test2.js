const bcrypt = require("bcryptjs");
const moment = require("moment");
const mongoose = require("mongoose");
const { BSON } = require("bson");
const { ObjectId, Long, Double, Int32, Decimal128, Timestamp } = BSON;
const axios = require("axios");
const accessKey = "tqMsEOfDWYkmAJBdiJ66SLHP7-jwTwYyHdB1PY94kak";
const { Agent, fetch, setGlobalDispatcher } = require("undici");

// house properties

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

const enviornmentList = [
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
  "آذربایجان غربی",
  "اردبیل",
  "اصفهان",
  "البرز",
  "ایلام",
  "بوشهر",
  "تهران",
  "چهارمحال و بختیاری",
  "خراسان جنوبی",
  "خراسان رضوی",
  "خراسان شمالی",
  "خوزستان",
  "زنجان",
  "سمنان",
  "سیستان و بلوچستان",
  "فارس",
  "قزوین",
  "قم",
  "کردستان",
  "کرمان",
  "کرمانشاه",
  "کهگیلویه و بویراحمد",
  "گلستان",
  "گیلان",
  "لرستان",
  "مازندران",
  "مرکزی",
  "هرمزگان",
  "همدان",
  "یزد",
];

const cities = [
  "تهران",
  "مشهد",
  "اصفهان",
  "کرج",
  "شیراز",
  "تبریز",
  "قم",
  "اهواز",
  "کرمانشاه",
  "ارومیه",
  "رشت",
  "زاهدان",
  "همدان",
  "کرمان",
  "یزد",
  "اردبیل",
  "بندرعباس",
  "اراک",
  "زنجان",
  "سنندج",
  "قزوین",
  "خرم‌آباد",
  "گرگان",
  "ساری",
  "بجنورد",
  "بوشهر",
  "بیرجند",
  "ایلام",
  "شهرکرد",
  "یاسوج",
  "سمنان",
];

// functions
function makeRandomProvince(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error("Input must be a non-empty array of strings");
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

function makeRandomCity(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error("Input must be a non-empty array of strings");
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

function makeRandomHouseType(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error("Input must be a non-empty array of strings");
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

function makeRandomHouseEnviornment(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error("Input must be a non-empty array of strings");
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

function makeRandomPrice(min = 150000, max = 1000000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeRandomRating(min = 1, max = 5) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomIranianPhoneNumber() {
  // Define mobile operator codes in Iran
  const operatorCodes = [
    "910",
    "911",
    "912",
    "913",
    "914",
    "915",
    "916",
    "917",
    "918",
    "919",
    "920",
    "921",
    "922",
    "930",
    "931",
    "932",
    "933",
    "934",
    "935",
    "936",
    "937",
    "938",
    "939",
    "990",
    "991",
    "992",
    "993",
    "994",
    "995",
    "996",
    "997",
    "998",
  ];

  // Pick a random operator code
  const randomOperatorCode =
    operatorCodes[Math.floor(Math.random() * operatorCodes.length)];

  // Generate the rest of the number (7 digits)
  let randomNumber = "";
  for (let i = 0; i < 7; i++) {
    randomNumber += Math.floor(Math.random() * 10); // Generate random digit from 0 to 9
  }

  // Combine country code, operator code, and the random number
  const iranianPhoneNumber = `0${randomOperatorCode}${randomNumber}`;

  return iranianPhoneNumber;
}

function generateRandomHouseImage() {
  const apiKey = "tqMsEOfDWYkmAJBdiJ66SLHP7-jwTwYyHdB1PY94kak"; // Replace with your Unsplash API key
  const url = `https://api.unsplash.com/photos/random?query=cottage&client_id=${apiKey}`;

  try {
    const response = fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const data = response.json();
    const imageUrl = data.urls.regular;

    return imageUrl;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

// create new fake houses
let houses = [];
let owners = [];

for (let i = 0; i < 1; i++) {
  let newHouses = {
    owner: new ObjectId().toString(),
    name: `خانه ${i + 1}`,
    province: makeRandomProvince(provinces),
    city: makeRandomCity(cities),
    price: makeRandomPrice(),
    houseType: makeRandomHouseType(houseTypes),
    enviornment: makeRandomHouseEnviornment(enviornmentList),
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.",
    cover:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG4AmsnPw1mmGtdSxSdLIRgTLenF-NdiGJAElnuFE8n5DbMuWb_g6AKpbGrWKLQzzO05U&usqp=CAU",
    images: [
      "https://a0.muscache.com/im/pictures/e7e1331d-7863-426e-9401-894eef41de5b.jpg?im_w=960",
      "https://a0.muscache.com/im/pictures/23838e25-ef37-42ad-b5a2-721fc2ef3489.jpg?im_w=720",
      "https://a0.muscache.com/im/pictures/abd48c2f-b09d-43ae-863d-e9689c5047e0.jpg?im_w=720",
      "https://a0.muscache.com/im/pictures/62a2d181-c66d-4af0-8671-6cd694eaebd4.jpg?im_w=720",
      "https://a0.muscache.com/im/pictures/e7e1331d-7863-426e-9401-894eef41de5b.jpg?im_w=960",
      "https://a0.muscache.com/im/pictures/23838e25-ef37-42ad-b5a2-721fc2ef3489.jpg?im_w=720",
      "https://a0.muscache.com/im/pictures/abd48c2f-b09d-43ae-863d-e9689c5047e0.jpg?im_w=720",
      "https://a0.muscache.com/im/pictures/62a2d181-c66d-4af0-8671-6cd694eaebd4.jpg?im_w=720",
      "https://a0.muscache.com/im/pictures/62a2d181-c66d-4af0-8671-6cd694eaebd4.jpg?im_w=720",
    ],
    reviews: [
      {
        name: `کامنت ${i + 1}`,
        rating: makeRandomRating(),
        comment:
          "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. ",
        user: "66a281c79d053134cd52a7e6",
      },
    ],
  };

  houses.push(newHouses);
}

for (let i = 0; i < houses.length; i++) {
  newOwner = {
    _id: houses[i].owner,
    phone: getRandomIranianPhoneNumber(),
    password: bcrypt.hashSync("12345678", 12),
    name: `مالک ${i + 1}`,
    username: `username ${i + 1}`,
    email: `owner${i + 1}@owenr${i + 1}.com`,
  };

  owners.push(newOwner);
}

module.exports = { houses, owners };

