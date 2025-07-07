// house types
const houseTypes = [
  {
    src: "./images/houseTypes/residential.jpeg",
    type: "مسکونی",
    description: "خانه‌ای برای آرامش و زندگی روزمره",
  },
  {
    src: "./images/houseTypes/commercial.jpeg",
    type: "تجاری",
    description: "فرصتی عالی برای سرمایه‌گذاری تجاری",
  },
  {
    src: "./images/houseTypes/office.avif",
    type: "اداری",
    description: "فضایی مدرن برای کسب‌وکار شما",
  },
  {
    src: "./images/houseTypes/industrial.jpg",
    type: "صنعتی",
    description: "مناسب برای تولید و فعالیت صنعتی",
  },
  {
    src: "./images/houseTypes/agricultural.jpg",
    type: "کشاورزی",
    description: "زمین‌هایی مناسب برای کشت و زرع",
  },
  {
    src: "./images/houseTypes/villa.avif",
    type: "ویلاها",
    description: "زندگی لوکس در دل طبیعت",
  },
  {
    src: "./images/houseTypes/land.jpg",
    type: "زمین",
    description: "فرصتی مناسب برای ساخت و سرمایه‌گذاری",
  },
  {
    src: "./images/houseTypes/garden.jpg",
    type: "باغ",
    description: "آرامش در میان درختان و سرسبزی",
  },
  {
    src: "./images/houseTypes/warehouse.jpg",
    type: "انبار",
    description: "فضایی امن برای نگهداری کالا",
  },
  {
    src: "./images/houseTypes/shop.jpg",
    type: "مغازه",
    description: "مکان مناسب برای کسب‌وکار محلی",
  },
  {
    src: "./images/houseTypes/apartment.jpg",
    type: "آپارتمان",
    description: "زندگی راحت در دل شهر",
  },
  {
    src: "./images/houseTypes/penthouses.jpg",
    type: "پنت‌هاوس",
    description: "سبک زندگی لوکس در ارتفاع",
  },
  {
    src: "./images/houseTypes/duplex.jpg",
    type: "دوبلکس",
    description: "خانه‌ای دلباز با طراحی مدرن",
  },
  {
    src: "./images/houseTypes/suite.jpg",
    type: "سوییت",
    description: "کوچک، جمع‌وجور و کاربردی",
  },
  {
    src: "./images/houseTypes/hotel.avif",
    type: "هتل",
    description: "فرصتی برای سرمایه‌گذاری گردشگری",
  },
  {
    src: "./images/houseTypes/clinic.avif",
    type: "کلینیک",
    description: "محلی برای ارائه خدمات درمانی",
  },
  {
    src: "./images/houseTypes/cottage.jpg",
    type: "کلبه",
    description: "فراری عاشقانه از هیاهوی شهر",
  },
  {
    src: "./images/houseTypes/room.jpg",
    type: "اتاق",
    description: "انتخابی اقتصادی و ساده",
  },
  {
    src: "./images/houseTypes/old.avif",
    type: "قدیمی",
    description: "دارای اصالت و معماری خاص",
  },
  {
    src: "./images/houseTypes/new.avif",
    type: "نوساز",
    description: "ساختمان‌هایی مدرن و آماده سکونت",
  },
  {
    src: "./images/houseTypes/renovated.jpg",
    type: "بازسازی",
    description: "پتانسیل بالا پس از نوسازی",
  },
  {
    src: "./images/houseTypes/farm.avif",
    type: "دامداری / مرغداری",
    description: "مناسب فعالیت‌های دامی و کشاورزی",
  },
  {
    src: "./images/houseTypes/other.jpeg",
    type: "سایر",
    description: "سایر املاک متنوع و خاص",
  },
];

const enviornmentTypes = [
  {
    src: "./images/enviornmentTypes/mountain.jpg",
    type: "کوهستانی",
    description: "فرار به بلندای آرامش و هوای تازه",
  },
  {
    src: "./images/enviornmentTypes/forest.jpg",
    type: "جنگلی",
    description: "در دل درختان، نفس بکش و رها شو",
  },
  {
    src: "./images/enviornmentTypes/sea.jpg",
    type: "دریا",
    description: "آرامشی بی‌انتها کنار موج‌ها",
  },
  {
    src: "./images/enviornmentTypes/beach.jpg",
    type: "ساحلی",
    description: "آفتاب، شن و سکوت دل‌انگیز",
  },
  {
    src: "./images/enviornmentTypes/desert.avif",
    type: "بیابانی",
    description: "سکوت طلایی میان تپه‌های شنی",
  },
  {
    src: "./images/enviornmentTypes/wild.jpg",
    type: "حیات وحش ",
    description: "زندگی در دل طبیعت بکر و خالص",
  },
  {
    src: "./images/enviornmentTypes/ecotourism.jpg",
    type: "بوم گردی ",
    description: "تجربه‌ای اصیل و نزدیک به فرهنگ بومی",
  },
  {
    src: "./images/enviornmentTypes/ancient.jpg",
    type: "باستانی تاریخی ",
    description: "سفر به اعماق تاریخ و تمدن",
  },
  {
    src: "./images/enviornmentTypes/citycenter.jpg",
    type: "مرکز شهر ",
    description: "در قلب زندگی شهری و هیجان روزمره",
  },
  {
    src: "./images/enviornmentTypes/village.png",
    type: "روستایی ",
    description: "زندگی ساده و دلنشین در دل طبیعت",
  },
  {
    src: "./images/enviornmentTypes/other.jpg",
    type: "سایر ",
    description: "تجربه‌ای متفاوت، فراتر از دسته‌بندی‌ها",
  },
];


const favoriteCities = [
  { src: './images/cities/mashhad.jpg', text: 'مشهد' },
  { src: './images/cities/shiraz.jpg', text: 'شیراز' },
  { src: './images/cities/isfahan.jpg', text: 'اصفهان' },
  { src: './images/cities/yazd.png', text: 'یزد' },
  { src: './images/cities/tabriz.png', text: 'تبریز' },
  { src: './images/cities/ahvaz.jpg', text: 'اهواز' },
  { src: './images/cities/sanandaj.png', text: 'سنندج' },
  { src: './images/cities/rasht.png', text: 'رشت' },
  { src: './images/cities/sari.jpg', text: 'ساری' },
  { src: './images/cities/ramsar.jpg', text: 'رامسر' },
  { src: './images/cities/kerman.png', text: 'کرمان' },
  { src: './images/cities/zahedan.png', text: 'زاهدان' },
  { src: './images/cities/ghom.png', text: 'قم' },
  { src: './images/cities/ardebil.jpg', text: 'اردبیل' },
  { src: './images/cities/boshehr.png', text: 'بوشهر' },
  { src: './images/cities/bandar-abbas.png', text: 'بندرعباس' },
  { src: './images/cities/kish.avif', text: 'کیش' },
  { src: './images/cities/gheshm.jpeg', text: 'قشم' }
];


export { houseTypes, enviornmentTypes,favoriteCities };
