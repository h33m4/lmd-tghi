"use client";
import DatePicker from "@/components/ui/datepicker";
import { useState } from "react";

interface DataRangePickerProps {
  onRangeChange: (dates: [Date | null, Date | null]) => void;
  rangeValues: [Date | null, Date | null];
}

const DataRangePicker: React.FC<DataRangePickerProps> = ({
  onRangeChange,
  rangeValues,
}) => {
  const [start, end] = rangeValues;
  // const [startRangeDate, setStartRangeDate] = useState<Date | null>(start);
  // const [endRangeDate, setEndRangeDate] = useState<Date | null>(end);

  const handleRangeChange = (dates: [Date | null, Date | null]) => {
    // const [start, end] = dates;
    // setStartRangeDate(start);
    // setEndRangeDate(end);
    onRangeChange(dates);
  };

  return (
    <DatePicker
      wrapperClassName="w-80 h-8"
      //   className="w-80 h-8"
      selected={start}
      onChange={handleRangeChange}
      startDate={start}
      endDate={end}
      monthsShown={2}
      placeholderText="Select Date in a Range"
      selectsRange
      inputProps={{
        id: "filter-text-box",
        // clearable: true,
        // onClear: () => {
        //   setStartRangeDate(null);
        //   setEndRangeDate(null);
        // },
      }}
    />
  );
};

export default DataRangePicker;
