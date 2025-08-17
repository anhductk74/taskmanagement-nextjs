"use client";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DueDatePicker() {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;

  const handleApply = () => {
    if (startDate && endDate) {
      console.log("Ngày bắt đầu:", startDate);
      console.log("Ngày kết thúc:", endDate);
      // Thực hiện hành động ở đây (API call, update state, ...)
    }
  };

  return (
    <div className="relative">
      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => setDateRange(update)}
        isClearable={true}
        placeholderText="Chọn khoảng ngày"
        className="border rounded-md px-2 py-1 cursor-pointer"
      />

      <button
        onClick={handleApply}
        className="ml-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Áp dụng
      </button>
    </div>
  );
}
