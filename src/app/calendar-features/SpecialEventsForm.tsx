import { MapPinIcon, UserIcon, DollarSignIcon } from "lucide-react";

import { NotebookIcon } from "lucide-react";
import React from "react";

export interface SpecialEventData {
  eventName: string;
  location: string;
  attendees: number;
  budget: number;
}

interface SpecialEventsFormProps {
  data: SpecialEventData;
  onUpdate: (data: SpecialEventData) => void;
}

export const SpecialEventsForm = ({
  data,
  onUpdate,
}: SpecialEventsFormProps) => {
  const handleChange = (
    field: keyof SpecialEventData,
    value: string | number
  ) => {
    onUpdate({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="flex w-full bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-16 bg-blue-50 dark:bg-blue-900/30 flex flex-col items-center justify-center gap-2 py-4 border-r border-blue-100 dark:border-blue-800 capitalize text-xs">
        {"special events".split("").map((char, idx) => (
          <span key={idx}>{char}</span>
        ))}
      </div>

      {/* Form Content */}
      <div className="flex-grow flex flex-col gap-4 p-4">
        {/* Event Name */}
        <div>
          <label
            htmlFor="eventName"
            className="w-full flex items-center justify-start gap-2 py-2 text-sm font-medium text-purple-700 dark:text-purple-300"
          >
            <NotebookIcon
              size={18}
              className="text-purple-600 dark:text-purple-400"
            />
            Event description
          </label>
          <input
            type="text"
            id="eventName"
            value={data.eventName}
            onChange={(e) => handleChange("eventName", e.target.value)}
            placeholder="Enter event name"
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Location */}
        <div>
          <label
            htmlFor="location"
            className="w-full flex items-center justify-start gap-2 py-2 text-sm font-medium text-green-700 dark:text-green-300"
          >
            <MapPinIcon
              size={18}
              className="text-green-600 dark:text-green-400"
            />
            Location
          </label>
          <input
            type="text"
            id="location"
            value={data.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="Enter event location"
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 border-green-200 dark:border-green-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Attendees */}
        <div>
          <label
            htmlFor="attendees"
            className="w-full flex items-center justify-start gap-2 py-2 text-sm font-medium text-orange-700 dark:text-orange-300"
          >
            <UserIcon
              size={18}
              className="text-orange-600 dark:text-orange-400"
            />
            Number of Attendees
          </label>
          <input
            type="number"
            id="attendees"
            value={data.attendees}
            onChange={(e) => handleChange("attendees", Number(e.target.value))}
            placeholder="Expected number of attendees"
            min="0"
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-800 border-orange-200 dark:border-orange-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Budget */}
        <div>
          <label
            htmlFor="budget"
            className="w-full flex items-center justify-start gap-2 py-2 text-sm font-medium text-blue-700 dark:text-blue-300"
          >
            <DollarSignIcon
              size={18}
              className="text-blue-600 dark:text-blue-400"
            />
            Event Budget
          </label>
          <input
            type="number"
            id="budget"
            value={data.budget}
            onChange={(e) => handleChange("budget", Number(e.target.value))}
            placeholder="Enter event budget"
            min="0"
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
    </div>
  );
};
