import React from "react";

import {
  LinkIcon,
  NotebookIcon,
  Plus,
  Tag,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TodoFormProps {
  data: {
    description?: string;
    priority?: string;
    tags?: string;
    links?: string[];
  };
  onUpdate: (updatedData: TodoFormProps["data"]) => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({ data, onUpdate }) => {
  const handleDescriptionChange = (description: string) => {
    onUpdate({ description });
  };

  const handlePriorityChange = (priority: string) => {
    onUpdate({ priority });
  };

  const handleTagsChange = (tags: string) => {
    onUpdate({ tags });
  };

  const handleAddLink = (newLink: string) => {
    if (newLink.trim() && !data?.links?.includes(newLink)) {
      const updatedLinks = [...(data?.links || []), newLink.trim()];
      onUpdate({ links: updatedLinks });
    }
  };

  const handleRemoveLink = (linkToRemove: string) => {
    const updatedLinks = data?.links?.filter((link) => link !== linkToRemove);
    onUpdate({ links: updatedLinks });
  };

  return (
    <div className="flex w-full bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-16 bg-blue-50 dark:bg-blue-900/30 flex flex-col items-center justify-center gap-2 py-4 border-r border-blue-100 dark:border-blue-800 capitalize text-sm">
        {"todo list".split("").map((char, idx) => (
          <span key={idx}>{char}</span>
        ))}
      </div>
      {/* Form Content */}
      <div className="flex-grow flex flex-col gap-4 p-4">
        {/* Task Description */}
        <div>
          <label
            htmlFor="description"
            className="w-full flex items-center justify-start gap-2 py-2 text-sm font-medium text-blue-700 dark:text-blue-300"
          >
            <NotebookIcon
              size={18}
              className="text-blue-600 dark:text-blue-400"
            />
            Task Description
          </label>
          <input
            type="text"
            id="description"
            value={data.description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Enter task description"
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
            Priority
          </label>
          <select
            id="priority"
            value={data.priority}
            onChange={(e) => handlePriorityChange(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-800 border-yellow-200 dark:border-yellow-700 text-gray-900 dark:text-gray-100 text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Tags */}
        <div>
          <label
            htmlFor="tags"
            className="w-full flex items-center justify-start gap-2 py-2 text-sm font-medium text-green-700 dark:text-green-300"
          >
            <Tag size={18} className="text-green-600 dark:text-green-400" />
            Tags
          </label>
          <input
            type="text"
            id="tags"
            value={data.tags}
            onChange={(e) => handleTagsChange(e.target.value)}
            placeholder="Add tags (comma-separated)"
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 border-green-200 dark:border-green-700 text-gray-900 dark:text-gray-100 text-sm"
          />
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
            Add Links
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              id="newLink"
              value="" // Controlled by local state in original implementation
              onChange={(e) => handleAddLink(e.target.value)}
              placeholder="Enter a link"
              className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-700 text-gray-900 dark:text-gray-100 text-sm"
            />
            <Button
              type="button"
              onClick={() => handleAddLink("")}
              size="icon"
              variant="outline"
              className="border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              <Plus />
            </Button>
          </div>
          <ul className="mt-2">
            {data?.links?.map((link, index) => (
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
      </div>
    </div>
  );
};
