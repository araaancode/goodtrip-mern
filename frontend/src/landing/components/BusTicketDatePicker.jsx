import React, { useState } from "react";
import { Calendar } from "react-modern-calendar-datepicker";
import "react-modern-calendar-datepicker/lib/DatePicker.css";

const BusTicketDatePicker = () => {
  // وضعیت اولیه تاریخ رفت و برگشت
  const [selectedDates, setSelectedDates] = useState({
    from: null,
    to: null
  });

  // تابع برای فرمت کردن تاریخ جهت نمایش
  const formatDate = (date) => {
    if (!date) return "";
    return `${date.day}/${date.month}/${date.year}`;
  };

  return (
    <div style={{ maxWidth: "350px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2>انتخاب تاریخ رفت و برگشت</h2>
      
      <Calendar
        // تاریخ انتخاب شده به صورت range (از start تا end)
        value={selectedDates}
        onChange={setSelectedDates}
        // تعیین رنگ اصلی و سایر استایل‌ها (بسته به سلیقه شما)
        colorPrimary="#0fbcf9" 
        calendarClassName="custom-calendar"  // در صورت نیاز می‌توانید CSS سفارشی اضافه کنید
        // تعیین تاریخ‌های حداقل و حداکثر (اختیاری)
        minimumDate={{
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          day: new Date().getDate(),
        }}
        // این قسمت را می‌توانید بر اساس نیاز تغییر دهید
        renderFooter={() => (
          <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem" }}>
            لطفاً تاریخ رفت و برگشت را انتخاب کنید.
          </div>
        )}
      />

      <div style={{ marginTop: "1rem", padding: "0 1rem", textAlign: "center" }}>
        {selectedDates.from && selectedDates.to ? (
          <div>
            <p>
              <strong>تاریخ رفت:</strong> {formatDate(selectedDates.from)}
            </p>
            <p>
              <strong>تاریخ برگشت:</strong> {formatDate(selectedDates.to)}
            </p>
          </div>
        ) : (
          <p>هنوز تاریخ‌ها انتخاب نشده‌اند</p>
        )}
      </div>
    </div>
  );
};

export default BusTicketDatePicker;
