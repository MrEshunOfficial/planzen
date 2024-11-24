import { Bell, MessageSquare } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { AlarmPlus, CalendarIcon, Clock } from "lucide-react";
import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import { Button } from "@/components/ui/button";
import { IRepeatConfig, RepeatType } from "@/store/event.types";

interface DateTimePickerProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  startTime: Date | null;
  setStartTime: (time: Date | null) => void;
  endTime: Date | null;
  setEndTime: (time: Date | null) => void;
  isAllDayEvent: boolean;
}
const repeatOptions = [
  { value: RepeatType.NO_REPEAT, label: "Does not repeat" },
  { value: RepeatType.DAILY, label: "Daily" },
  { value: RepeatType.WEEKLY, label: "Weekly" },
  { value: RepeatType.MONTHLY, label: "Monthly" },
  { value: RepeatType.YEARLY, label: "Yearly" },
  { value: RepeatType.CUSTOM, label: "Custom" },
];

export const DateTimeComponent: React.FC<DateTimePickerProps> = ({
  selectedDate,
  setSelectedDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  isAllDayEvent,
}) => {
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleStartTimeChange = (time: Date | null) => {
    setStartTime(time);
  };

  const handleEndTimeChange = (time: Date | null) => {
    setEndTime(time);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-2 my-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date Picker */}
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="date"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
          >
            <CalendarIcon className=" text-blue-500" size={18} />
            Date
          </label>
          <div className="relative">
            <ReactDatePicker
              id="date"
              selected={selectedDate}
              onChange={handleDateChange}
              className="w-full pl-3 py-2 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out text-sm"
              placeholderText="Select Date"
              dateFormat="MMMM d, yyyy"
            />
          </div>
        </div>

        {!isAllDayEvent && (
          <>
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="start-time"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
              >
                <Clock className=" text-green-500" size={18} />
                Start Time
              </label>
              <div className="relative">
                <ReactDatePicker
                  id="start-time"
                  selected={startTime}
                  onChange={handleStartTimeChange}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Start Time"
                  dateFormat="h:mm:ss aa"
                  className="w-full pl-3 py-2 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 ease-in-out text-sm"
                />
              </div>
            </div>
            {/* End Time Picker */}
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="end-time"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
              >
                <Clock className="text-red-500" size={18} />
                End Time
              </label>
              <div className="relative">
                <ReactDatePicker
                  id="end-time"
                  selected={endTime}
                  onChange={handleEndTimeChange}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="End Time"
                  dateFormat="h:mm:ss aa"
                  className="w-full pl-3 py-2 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 ease-in-out text-sm"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface EventRepeatSelectionProps {
  setIsAllDayEvent: (value: boolean) => void;
  selectedRepeat: RepeatType;
  setSelectedRepeat: (value: RepeatType) => void; // Changed from string to RepeatType
  customRepeatConfig: IRepeatConfig;
  setCustomRepeatConfig: React.Dispatch<React.SetStateAction<IRepeatConfig>>;
}

export const EventRepeatSelection: React.FC<EventRepeatSelectionProps> = ({
  setIsAllDayEvent,
  selectedRepeat,
  setSelectedRepeat,
  customRepeatConfig,
  setCustomRepeatConfig,
}) => {
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
  React.useEffect(() => {
    if (selectedRepeat === RepeatType.CUSTOM) {
      setIsCustomDialogOpen(true);
    }
  }, [selectedRepeat]);

  const handleRepeatChange = (value: string) => {
    // Convert the string value to RepeatType
    setSelectedRepeat(value as RepeatType);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-2 mb-2">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-2 flex-1">
          <Checkbox
            onCheckedChange={(checked) => setIsAllDayEvent(!!checked)}
          />

          <label
            htmlFor="all-day"
            className="text-sm font-medium cursor-pointer"
          >
            All day
          </label>
        </div>

        <div className="flex-1">
          <Select
            value={selectedRepeat}
            onValueChange={(value) => {
              setSelectedRepeat(value as RepeatType);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select repeat" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Repeat Options</SelectLabel>
                {/* Remove the nested Select component as it's redundant */}
                <SelectItem value={RepeatType.NO_REPEAT}>No Repeat</SelectItem>
                <SelectItem value={RepeatType.DAILY}>Daily</SelectItem>
                <SelectItem value={RepeatType.WEEKLY}>Weekly</SelectItem>
                <SelectItem value={RepeatType.MONTHLY}>Monthly</SelectItem>
                <SelectItem value={RepeatType.YEARLY}>Yearly</SelectItem>
                <SelectItem value={RepeatType.CUSTOM}>Custom</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <CustomRepeat
        open={isCustomDialogOpen}
        onOpenChange={setIsCustomDialogOpen}
        onClose={() => {
          if (selectedRepeat === RepeatType.CUSTOM) {
            setSelectedRepeat(RepeatType.NO_REPEAT);
          }
        }}
        config={customRepeatConfig}
        onConfigUpdate={setCustomRepeatConfig}
      />
    </div>
  );
};

interface CustomRepeatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  config: any;
  onConfigUpdate: (config: any) => void;
}

export const CustomRepeat: React.FC<CustomRepeatProps> = ({
  open,
  onOpenChange,
  onClose,
  config,
  onConfigUpdate,
}) => {
  // Initialize state from props
  const [repeatPattern, setRepeatPattern] = useState(config.repeatPattern);
  const [repeatFrequency, setRepeatFrequency] = useState(
    config.repeatFrequency
  );
  const [selectedDays, setSelectedDays] = useState(config.selectedDays);
  const [endRepeatOption, setEndRepeatOption] = useState(
    config.endRepeatOption
  );
  const [endDate, setEndDate] = useState(config.endDate);
  const [occurrences, setOccurrences] = useState(config.occurrences);
  const [repeatMonth, setRepeatMonth] = useState(config.repeatMonth);
  const [monthDate, setMonthDate] = useState(config.monthDate);

  const daysOfWeek = [
    { short: "Mon" },
    { short: "Tue" },
    { short: "Wed" },
    { short: "Thu" },
    { short: "Fri" },
    { short: "Sat" },
    { short: "Sun" },
  ];
  const monthOfYear = [
    { short: "Jan" },
    { short: "Feb" },
    { short: "Mar" },
    { short: "Apr" },
    { short: "May" },
    { short: "Jun" },
    { short: "Jul" },
    { short: "Aug" },
    { short: "Sep" },
    { short: "Oct" },
    { short: "Nov" },
    { short: "Dec" },
  ];

  const toggleDay = (day: string) => {
    setSelectedDays((prev: string[]) =>
      prev.includes(day)
        ? prev.filter((d: string) => d !== day)
        : [...prev, day]
    );
  };

  const handleSave = () => {
    const newConfig = {
      repeatPattern,
      repeatFrequency,
      selectedDays,
      endRepeatOption,
      endDate,
      occurrences,
      repeatMonth,
      monthDate,
    };

    onConfigUpdate(newConfig);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Custom Repeat Configuration
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {`Configure your event's repeat pattern in detail`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Repeat Pattern Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-2">Repeat Pattern</Label>
              <Select value={repeatPattern} onValueChange={setRepeatPattern}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Pattern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={RepeatType.NO_REPEAT}>
                    No Repeat
                  </SelectItem>
                  <SelectItem value={RepeatType.DAILY}>Daily</SelectItem>
                  <SelectItem value={RepeatType.WEEKLY}>Weekly</SelectItem>
                  <SelectItem value={RepeatType.MONTHLY}>Monthly</SelectItem>
                  <SelectItem value={RepeatType.YEARLY}>Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2">Frequency</Label>
              <Input
                type="number"
                min="1"
                value={repeatFrequency}
                onChange={(e) => setRepeatFrequency(Number(e.target.value))}
                placeholder="Every X"
                className="w-full"
              />
            </div>
          </div>

          {/* Day Selection (for weekly pattern) */}
          {repeatPattern === RepeatType.WEEKLY && (
            <div>
              <Label className="mb-2">Repeat on</Label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => (
                  <Button
                    key={day.short}
                    variant={
                      selectedDays.includes(day.short) ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => toggleDay(day.short)}
                    className="w-14"
                  >
                    {day.short}
                  </Button>
                ))}
              </div>
            </div>
          )}
          {repeatPattern === RepeatType.YEARLY && (
            <div>
              <Label className="mb-2">Select Months</Label>
              <div className="flex flex-wrap gap-2">
                {monthOfYear.map((month) => (
                  <Button
                    key={month.short}
                    variant={
                      selectedDays.includes(month.short) ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => toggleDay(month.short)}
                    className="w-14"
                  >
                    {month.short}
                  </Button>
                ))}
              </div>
              <div className="mt-2">
                <Label className="my-2">
                  Day of the Month (e.g 15th of every month)
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={repeatMonth}
                  onChange={(e) => setRepeatMonth(Number(e.target.value))}
                  placeholder="Enter number..."
                  className="w-full"
                />
              </div>
            </div>
          )}
          {repeatPattern === RepeatType.MONTHLY && (
            <div className="w-full flex flex-col items-start gap-2">
              <Label className="mb-0">select date</Label>
              <ReactDatePicker
                selected={monthDate}
                onChange={(date: Date | null) => setMonthDate(date)}
                className="w-full p-2 border rounded"
                placeholderText="Repeat Date"
              />
            </div>
          )}

          {/* End Repeat Options */}
          <div>
            <Label className="mb-2">End Repeat</Label>
            <RadioGroup
              value={endRepeatOption}
              onValueChange={(value: "never" | "on" | "after") =>
                setEndRepeatOption(value)
              }
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="never" id="never" />
                <Label htmlFor="never">Continuos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="on" id="on" />
                <Label htmlFor="on">On</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="after" id="after" />
                <Label htmlFor="after">After</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Conditional End Date or Occurrences */}
          {endRepeatOption === "on" && (
            <div className="w-full flex flex-col items-start gap-2">
              <Label className="mb-0">End Date</Label>
              <ReactDatePicker
                selected={endDate}
                onChange={(date: Date | null) => setEndDate(date)}
                className="w-full p-2 border rounded"
                placeholderText="Pick an end date"
              />
            </div>
          )}

          {endRepeatOption === "after" && (
            <div>
              <Label className="mb-2">Number of Occurrences</Label>
              <Input
                type="number"
                min="1"
                value={occurrences}
                onChange={(e) => setOccurrences(Number(e.target.value))}
                placeholder="Enter number of occurrences"
                className="w-full"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!repeatPattern}>
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
