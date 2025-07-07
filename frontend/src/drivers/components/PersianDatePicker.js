import React from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const PersianDatePicker = ({ onChange }) => {
  return (
    <DatePicker
      onlyYearPicker
      calendar={persian}
      locale={persian_fa}
      format="YYYY"
      placeholder="سال تولد را انتخاب کنید"
      onChange={(date) => onChange(date?.year)}
    />
  );
};

export default PersianDatePicker;
