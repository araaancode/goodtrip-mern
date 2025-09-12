export const formatPrice = (price) => {
  if (isNaN(price)) return "قیمت نامعتبر";
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
};
