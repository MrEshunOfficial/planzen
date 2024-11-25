import React, { useState, useEffect } from "react";
import { NotebookIcon, Tag, TriangleAlert } from "lucide-react";

// Define Priority enum
export enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

// Define interfaces for the routine data
interface RoutineFormData {
  routineNotes: string;
  priority: Priority;
  label: string;
}

interface RoutineFormProps {
  onSubmit: (data: RoutineFormData) => void;
  initialData?: Partial<RoutineFormData>;
}

export const RoutineForm: React.FC<RoutineFormProps> = ({
  onSubmit,
  initialData = {
    routineNotes: "",
    priority: Priority.MEDIUM,
    label: "",
  },
}) => {
  const [routineData, setRoutineData] = useState<RoutineFormData>({
    routineNotes: initialData.routineNotes || "",
    priority: initialData.priority || Priority.MEDIUM,
    label: initialData.label || "",
  });

  // Update local state when initialData changes
  useEffect(() => {
    setRoutineData({
      routineNotes: initialData.routineNotes || "",
      priority: initialData.priority || Priority.MEDIUM,
      label: initialData.label || "",
    });
  }, [initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    const updatedData = {
      ...routineData,
      [id]: id === "priority" ? (value as Priority) : value,
    };
    setRoutineData(updatedData);
    onSubmit(updatedData);
  };

  return (
    <div className="flex w-full bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-16 bg-blue-50 dark:bg-blue-900/30 flex flex-col items-center justify-center gap-2 py-4 border-r border-blue-100 dark:border-blue-800 capitalize text-sm">
        {"routine".split("").map((char, idx) => (
          <span key={idx}>{char}</span>
        ))}
      </div>
      {/* Form Content */}
      <div className="flex-grow flex flex-col gap-4 p-4">
        {/* Routine Notes */}
        <div>
          <label
            htmlFor="routineNotes"
            className="w-full flex items-center justify-start gap-2 py-2 text-sm font-medium text-blue-700 dark:text-blue-300"
          >
            <NotebookIcon
              size={18}
              className="text-blue-600 dark:text-blue-400"
            />
            Routine Notes
          </label>
          <input
            type="text"
            id="routineNotes"
            value={routineData.routineNotes}
            onChange={handleInputChange}
            placeholder="Enter routine notes"
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700 text-gray-900 dark:text-gray-100 text-sm"
          />
        </div>

        {/* Priority Selector */}
        <div>
          <label
            htmlFor="priority"
            className="w-full flex items-center justify-start gap-2 py-2 text-sm font-medium text-yellow-700 dark:text-yellow-300"
          >
            <TriangleAlert
              size={18}
              className="text-yellow-600 dark:text-yellow-400"
            />
            Urgency
          </label>
          <select
            id="priority"
            value={routineData.priority}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-800 border-yellow-200 dark:border-yellow-700 text-gray-900 dark:text-gray-100 text-sm"
          >
            <option value={Priority.LOW}>Low</option>
            <option value={Priority.MEDIUM}>Medium</option>
            <option value={Priority.HIGH}>High</option>
          </select>
        </div>

        {/* Label */}
        <div>
          <label
            htmlFor="label"
            className="w-full flex items-center justify-start gap-2 py-2 text-sm font-medium text-green-700 dark:text-green-300"
          >
            <Tag size={18} className="text-green-600 dark:text-green-400" />
            Routine Label
          </label>
          <input
            type="text"
            id="label"
            value={routineData.label}
            onChange={handleInputChange}
            placeholder="Add labels (comma-separated)"
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 border-green-200 dark:border-green-700 text-gray-900 dark:text-gray-100 text-sm"
          />
        </div>
      </div>
    </div>
  );
};
