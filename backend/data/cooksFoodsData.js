const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongoose").Types;

const foodImages = [
  "https://last-cdn.com/2024/01/03/YKRrofIiCkDLFPllkECDzz8FMvW1KsRISKByvj2w.jpg",
  "https://last-cdn.com/2024/01/03/YTRBXvrxwjcTrOCCmLI9P9zRp6FPi3N4GInQ39QD.jpg",
  "https://last-cdn.com/2024/01/03/Debqg3YdOc4YgkM0syxVDxim1HYWbasQs6wR5b1c.jpg",
  "https://last-cdn.com/2024/01/03/Uwi75sYuagqI3z6XnPIOtCjM1g04MCc60hopx30i.jpg",
  "https://last-cdn.com/2024/01/03/L09k1EHHeb5rmXAD8VpChKonwh9zjaGG9Qgs8gNf.jpg",
  "https://last-cdn.com/2024/01/03/BfMxiPtJUFHv0Cdp980kjZdMdjnazLiomvohWDNG.jpg",
  "https://last-cdn.com/2024/01/03/m8rOeVPyOncB24WBuDoppXBvjC3sqveu7MzzQYn1.jpg",
  "https://last-cdn.com/2024/01/03/heV7SCjL4izdBp6S5xct7PBYLC36iDi2etZMbnGj.jpg",
  "https://last-cdn.com/2024/01/03/y96NEQrt08SOl9wKk8EWOwkCh7DHv0DB7WGY0euo.jpg",
  "https://last-cdn.com/2024/01/03/tffKIKZgTnGhdFyvqJCbwIJTQVbBVozVCEGo6SnX.jpg",
  "https://last-cdn.com/2024/01/03/XlzceZUOguzOdrQvIdjuAqfbBcEhgSw5SCrDyQUj.jpg",
  "https://last-cdn.com/2024/01/04/XvW1y3nX0iOGMey7QNxTCYtBRgBx0tFJD2R8VXXz.jpg",
  "https://last-cdn.com/2024/01/04/l713xEN0mCy5MIU492jveY5QpNMxLzmDYKRdOp9n.jpg",
  "https://last-cdn.com/2024/01/04/8pD3rTMsTJA8MQYhqJsr4mTYBFF9eNRpCASJuxwn.jpg",
  "https://last-cdn.com/2024/01/04/W8utfxmZtA61AIoeh4lGBsMFZ6k2FON1zz65Y8hc.jpg",
  "https://last-cdn.com/2024/01/04/DgqtmHcoEI5FExm7wtwL5nTZHecgS0Cb4DCSSRSU.jpg",
  "https://last-cdn.com/2024/01/04/jlpHEqcKRYzGHoJJWkYZ1869Y8PEp64vfnPrAIUl.jpg",
  "https://last-cdn.com/2024/01/04/Q8k1Y4UF0x2rh0b6oHivHmvWJBPL5XyZlvB8VSEJ.jpg",
  "https://last-cdn.com/2024/01/04/pGcMCBa6ppgVvjXlgY7FIasvSHruBwBGj4MlOHHk.jpg",
  "https://last-cdn.com/2024/01/04/c1pOkOP5IOsDDvvfTGmN0gCX9QTAoZlEHZzKd8Q3.jpg",
  "https://last-cdn.com/2024/01/04/5fd2466G06uLrexYBtgVl9DcxE8z1sMBoZNkarqH.jpg",
  "https://last-cdn.com/2024/01/04/bzXFqHOnc6TXEciDIkFZp23e6cjVjIx3QhKm6gaH.jpg",
  "https://last-cdn.com/2024/01/04/D0JIwqSbzcDyn0vdpL3prixY12EliKqkwKQc78XX.jpg",
  "https://last-cdn.com/2024/01/04/uYtz0ilgBOI0pQX0GjtRaxR7lw02QPgS8kK2yASF.jpg",
  "https://last-cdn.com/2024/01/04/KwhOCfn44QodaZkZV17CPsR1ppQ7wjr1jLcTNsFB.jpg",
  "https://last-cdn.com/2024/01/04/7huSLicltUsPQkETtlLRISxtjPbWaxPZIpoG1C8A.jpg",
  "https://last-cdn.com/2024/01/04/3cr0mHQ5zadLwJY4RKc9Uz29Vi7RxA0sqJQxccvT.jpg",
  "https://last-cdn.com/2024/01/04/kLabED4GrtX6WdI0ZZlYxRG1KR6mJ1Tdln4oateN.jpg",
  "https://last-cdn.com/2024/01/04/903pXgWRgrZF2Vnjaqunhhh5Sq3z4aX9bYpvW2vN.jpg",
  "https://last-cdn.com/2024/01/04/AuOjF2z4VW2rV0RaWKbyYH4lQjm3bZeQqtP7T0CX.jpg",
];

// 1. Lists for Persian Data
const persianNames = [
  "علی محمدی",
  "زهرا حسینی",
  "محمد رضایی",
  "فاطمه احمدی",
  "حسن کاظمی",
];

const persianFoods = [
  { name: "چلوکباب کوبیده" },
  { name: "چلوکباب برگ" },
  { name: "جوجه کباب" },
  { name: "زرشک پلو با مرغ" },
  { name: "قورمه سبزی" },
  { name: "قیمه" },
  { name: "فسنجان" },
  { name: "آبگوشت" },
  { name: "عدس پلو" },
  { name: "کوفته تبریزی" },
  { name: "کشک بادمجان" },
  { name: "میرزا قاسمی" },
  { name: "کتلت" },
  { name: "شامی کباب" },
  { name: "ته چین مرغ" },
  { name: "خوراک زبان" },
  { name: "کباب سلطانی" },
  { name: "سالاد الویه" },
  { name: "ساندویچ بندری" },
  { name: "ساندویچ مغز و زبان" },
  { name: "ساندویچ هات‌داگ" },
  { name: "ساندویچ ژامبون گوشت" },
  { name: "ساندویچ ژامبون مرغ" },
  { name: "ساندویچ فیله مرغ" },
  { name: "ساندویچ استیک" },
  { name: "برگر معمولی" },
  { name: "چیزبرگر" },
  { name: "دبل برگر" },
  { name: "بیگ مک" },
  { name: "پیتزا پپرونی" },
  { name: "پیتزا مخلوط" },
  { name: "پیتزا مخصوص" },
  { name: "پیتزا مرغ و قارچ" },
  { name: "پیتزا مارگاریتا" },
  { name: "پاستا آلفردو" },
  { name: "پاستا بلونز" },
  { name: "شنسل مرغ" },
  { name: "شنسل گوشت" },
  { name: "لازانیا" },
  { name: "استیک گوشت" },
  { name: "استیک مرغ" },
  { name: "فیش اند چیپس" },
  { name: "سوپ جو" },
  { name: "سوپ قارچ" },
  { name: "سیب‌زمینی سرخ‌کرده" },
  { name: "ناگت مرغ" },
  { name: "پاستا" },
  { name: "پیتزا" },
  { name: "سوشی" },
  { name: "فلافل" },
];

const cookSpecialties = ["غذاهای اصیل ایرانی", "کباب", "خورشت", "آش", "دسر"];

const foodCategories = [
  "پیش غذا",
  "غذای اصلی",
  "دسر و نوشیدنی",
  "ایتالیایی",
  "ایرانی",
  "ساندویچ",
  "فست فود",
  "سوپ",
  "آش",
];

const cookHours = [
  "۸:۰۰ تا ۱۶:۰۰",
  "۱۰:۰۰ تا ۲۲:۰۰",
  "۱۲:۰۰ تا ۲۴:۰۰",
  "فقط شب‌ها",
];

const cookDates = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
];

// return random food image
function getRandomFoodImage(array) {
  // Generate a random index between 0 and array.length - 1
  const randomIndex = Math.floor(Math.random() * array.length);
  // Return the item at the random index
  return array[randomIndex];
}

function getRandomRating() {
  return Math.floor(Math.random() * 5) + 1;
}

function generate12DigitNumber() {
  let number = "";
  for (let i = 0; i < 12; i++) {
    number += Math.floor(Math.random() * 10); // Adds a random digit (0–9)
  }
  return number;
}

// 2. Generate Cooks
function generateCook(index) {
  const hashedPassword = bcrypt.hashSync("12345678", 12);
  return {
    _id: new ObjectId().toString(),
    name: persianNames[index % persianNames.length],
    username: `cook${index + 1}`,
    nationalCode: (1000000000 + index).toString().padStart(10, "0"),
    gender: index % 2 === 0 ? "مرد" : "زن",
    city: [
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
    ][index % 3],
    province: [
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
    ][index % 3],
    email: `cook${index + 1}@example.com`,
    phone: `09${(100000000 + index).toString().padStart(9, "0")}`,
    cookDate: cookDates[index % cookDates.length], // Required
    cookHour: cookHours[index % cookHours.length], // Required
    isActive: true,
    address: [
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
    ][index % 3],
    password: hashedPassword,
    position: [
      [38.07, 46.301], // آذربایجان شرقی
      [37.552, 45.076], // آذربایجان غربی
      [38.249, 48.293], // اردبیل
      [32.654, 51.667], // اصفهان
      [35.996, 50.928], // البرز
      [33.637, 46.422], // ایلام
      [28.923, 50.82], // بوشهر
      [35.689, 51.389], // تهران
      [32.325, 50.864], // چهارمحال و بختیاری
      [32.866, 59.221], // خراسان جنوبی
      [36.297, 59.605], // خراسان رضوی
      [37.471, 57.101], // خراسان شمالی
      [31.318, 48.67], // خوزستان
      [36.676, 48.479], // زنجان
      [35.572, 53.395], // سمنان
      [29.496, 60.862], // سیستان و بلوچستان
      [29.61, 52.538], // فارس
      [36.088, 50.242], // قزوین
      [34.641, 50.876], // قم
      [35.311, 46.996], // کردستان
      [30.283, 57.083], // کرمان
      [34.314, 47.065], // کرمانشاه
      [30.65, 51.593], // کهگیلویه و بویراحمد
      [36.844, 54.435], // گلستان
      [37.28, 49.583], // گیلان
      [33.487, 48.353], // لرستان
      [36.565, 52.641], // مازندران
      [33.509, 49.457], // مرکزی
      [27.208, 56.368], // هرمزگان
      [34.798, 48.514], // همدان
      [31.897, 54.356], // یزد
    ][index % 3],
    createdAt: new Date(),
    updatedAt: new Date(),
    rating: getRandomRating(),
  };
}

// 3. Generate Foods
function generateFood(index, cook) {
  const foodTemplate = persianFoods[index % persianFoods.length];
  return {
    _id: new ObjectId().toString(),
    name: foodTemplate.name,
    type: foodTemplate.type,
    category: foodCategories[index % foodCategories.length], // Required
    cookDate: cook.cookDate,
    cookHour: cook.cookHour,
    cookName: cook.name,
    foodCode: generate12DigitNumber(),
    cook: cook._id,
    description: `توضیحات ${foodTemplate.name} توسط ${cook.name}`,
    price: 50000 + (index % 50) * 10000,
    photo: `${getRandomFoodImage(foodImages)}`,
    photos: [
      `${getRandomFoodImage(foodImages)}`,
      `${getRandomFoodImage(foodImages)}`,
      `${getRandomFoodImage(foodImages)}`,
      `${getRandomFoodImage(foodImages)}`,
      `${getRandomFoodImage(foodImages)}`,
      `${getRandomFoodImage(foodImages)}`,
    ],
    isActive: true,
    isAvailable: true,
    count: 10,
    rating: Math.floor(Math.random() * 5) + 1,
    reviews: [
      {
        user: new ObjectId().toString(),
        userName: cook.name,
        rating: Math.floor(Math.random() * 5) + 1,
        comment: "غذا خیلی خوشمزه بود",
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    rating: getRandomRating(),
  };
}

// 4. Generate Data
const cooks = Array.from({ length: 350 }, (_, index) => generateCook(index));
const foods = cooks.flatMap((cook, index) =>
  Array.from({ length: 3 }, (_, i) => generateFood(index * 3 + i, cook))
);

module.exports = { cooks, foods };
