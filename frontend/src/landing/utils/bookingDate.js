import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export const isValidDate = (dateString) => {
  if (!dateString) return false;
  try {
    const date = new DateObject({ date: dateString, calendar: persian, locale: persian_fa });
    return date.isValid;
  } catch {
    return false;
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return "تاریخ نامعتبر";
  try {
    return new DateObject({ date: dateString, calendar: persian, locale: persian_fa }).format();
  } catch {
    return "تاریخ نامعتبر";
  }
};
