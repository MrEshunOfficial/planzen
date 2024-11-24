// AppointmentForm.tsx
import { Button } from "@/components/ui/button";
import { AppointmentType } from "@/store/event.types";
import {
  CalendarIcon,
  LinkIcon,
  MapPinIcon,
  NotepadTextIcon,
  PhoneIcon,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export interface AppointmentData {
  venue: string;
  appointmentDate: string;
  contactNumber: string;
  appointmentType: AppointmentType;
  appointmentLinks: string[];
  additionalNotes: string;
}

interface AppointmentFormProps {
  data: AppointmentData;
  onUpdate: (data: AppointmentData) => void;
}

export const AppointmentForm = ({ data, onUpdate }: AppointmentFormProps) => {
  const [newLink, setNewLink] = useState<string>("");

  const handleAddLink = () => {
    if (newLink.trim() && !data.appointmentLinks.includes(newLink)) {
      onUpdate({
        ...data,
        appointmentLinks: [...data.appointmentLinks, newLink.trim()],
      });
      setNewLink("");
    }
  };

  const handleRemoveLink = (link: string) => {
    onUpdate({
      ...data,
      appointmentLinks: data.appointmentLinks.filter((l) => l !== link),
    });
  };

  const handleInputChange = (
    field: keyof AppointmentData,
    value: string | string[]
  ) => {
    onUpdate({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="flex w-full bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-16 bg-teal-50 dark:bg-teal-900/30 flex flex-col items-center justify-center gap-2 py-4 border-r border-teal-100 dark:border-teal-800 capitalize text-sm">
        <br /> a
        <br /> p
        <br /> p
        <br /> o
        <br /> i
        <br /> n
        <br /> t
        <br /> m
        <br /> e
        <br /> n
        <br /> t
      </div>

      {/* Form Content */}
      <div className="max-h-[45vh] overflow-auto flex-grow flex flex-col gap-4 p-4">
        {/* Venue */}
        <div>
          <label
            htmlFor="venue"
            className="w-full flex items-center justify-start gap-2 py-2 text-sm font-medium text-teal-700 dark:text-teal-300"
          >
            <MapPinIcon
              size={18}
              className="text-teal-600 dark:text-teal-400"
            />
            Venue
          </label>
          <input
            type="text"
            id="venue"
            value={data.venue}
            onChange={(e) => handleInputChange("venue", e.target.value)}
            placeholder="Enter venue"
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-800 border-teal-200 dark:border-teal-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Appointment Date */}
        <div>
          <label
            htmlFor="appointmentDate"
            className="w-full flex items-center justify-start gap-2 py-2 text-sm font-medium text-blue-700 dark:text-blue-300"
          >
            <CalendarIcon
              size={18}
              className="text-blue-600 dark:text-blue-400"
            />
            Appointment Date <small>(for appointments with end dates)</small>
          </label>
          <input
            type="date"
            id="appointmentDate"
            value={data.appointmentDate}
            onChange={(e) =>
              handleInputChange("appointmentDate", e.target.value)
            }
            className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Contact Number */}
        <div>
          <label
            htmlFor="contactNumber"
            className="w-full flex items-center justify-start gap-2 py-2 text-sm font-medium text-green-700 dark:text-green-300"
          >
            <PhoneIcon
              size={18}
              className="text-green-600 dark:text-green-400"
            />
            Contact Number
          </label>
          <input
            type="tel"
            id="contactNumber"
            value={data.contactNumber}
            onChange={(e) => handleInputChange("contactNumber", e.target.value)}
            placeholder="Enter contact number"
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 border-green-200 dark:border-green-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Appointment Type */}
        <div>
          <label
            htmlFor="appointmentType"
            className="w-full flex items-center justify-start gap-2 py-2 text-sm font-medium text-purple-700 dark:text-purple-300"
          >
            <NotepadTextIcon
              size={18}
              className="text-purple-600 dark:text-purple-400"
            />
            Appointment Type
          </label>
          <select
            id="appointmentType"
            value={data.appointmentType}
            onChange={(e) =>
              handleInputChange("appointmentType", e.target.value)
            }
            className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700 text-gray-900 dark:text-gray-100"
          >
            <option value="consultation">Consultation</option>
            <option value="meeting">Meeting</option>
            <option value="discussion">Discussion</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Add Links */}
        <div>
          <label
            htmlFor="links"
            className="w-full flex items-center justify-start gap-2 py-2 text-sm font-medium text-purple-700 dark:text-purple-300"
          >
            <LinkIcon
              size={18}
              className="text-purple-600 dark:text-purple-400"
            />
            Add Links (if needed)
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              id="newLink"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              placeholder="Enter a link"
              className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700 text-gray-900 dark:text-gray-100 text-sm"
            />
            <Button
              type="button"
              onClick={handleAddLink}
              size="icon"
              variant="outline"
              className="border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              <Plus />
            </Button>
          </div>
          <ul className="mt-2">
            {data.appointmentLinks.map((link, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 border-b border-purple-100 dark:border-purple-800"
              >
                <span className="text-sm text-purple-700 dark:text-purple-300">
                  {link}
                </span>
                <Button
                  type="button"
                  onClick={() => handleRemoveLink(link)}
                  variant="ghost"
                  className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                >
                  <Trash2 />
                </Button>
              </li>
            ))}
          </ul>
        </div>

        {/* Additional Notes */}
        <div>
          <label
            htmlFor="additionalNotes"
            className="w-full flex items-center justify-start gap-2 py-2 text-sm font-medium text-orange-700 dark:text-orange-300"
          >
            <NotepadTextIcon
              size={18}
              className="text-orange-600 dark:text-orange-400"
            />
            Appointment Notes
          </label>
          <textarea
            id="additionalNotes"
            value={data.additionalNotes}
            onChange={(e) =>
              handleInputChange("additionalNotes", e.target.value)
            }
            placeholder="Any additional information or special requirements"
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-800 border-orange-200 dark:border-orange-700 text-gray-900 dark:text-gray-100 h-24"
          />
        </div>
      </div>
    </div>
  );
};
