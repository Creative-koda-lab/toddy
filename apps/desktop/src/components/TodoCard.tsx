import { useState, useRef, useEffect } from "react";
import { Todo } from "../types/todo";
import { TAG_COLORS, TAG_LABELS } from "../constants/tags";

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

/**
 * TodoCard Component
 *
 * Displays a single todo item with its title, description, tags,
 * and action buttons (complete, edit, delete).
 */
export function TodoCard({ todo, onToggle, onDelete, onEdit }: TodoCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  /**
   * Close context menu when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3
            className={`text-lg font-semibold text-gray-800 mb-1 ${
              todo.completed ? "line-through text-gray-500" : ""
            }`}
          >
            {todo.title}
          </h3>
          <p
            className={`text-sm text-gray-600 ${
              todo.completed ? "line-through text-gray-400" : ""
            }`}
          >
            {todo.description}
          </p>
        </div>

        {/* Three dots menu */}
        <div className="relative ml-2" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-gray-600"
            aria-label="More options"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="6" r="1" fill="currentColor" />
              <circle cx="12" cy="12" r="1" fill="currentColor" />
              <circle cx="12" cy="18" r="1" fill="currentColor" />
            </svg>
          </button>

          {/* Contextual menu */}
          {showMenu && (
            <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-32 z-10">
              <button
                onClick={() => {
                  onEdit(todo.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete(todo.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {todo.tags.map((tag) => (
            <div
              key={tag}
              className={`w-8 h-8 rounded-full ${TAG_COLORS[tag]}`}
              title={TAG_LABELS[tag]}
            />
          ))}
        </div>

        <button
          onClick={() => onToggle(todo.id)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <div
            className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
              todo.completed
                ? "bg-gray-700 border-gray-700"
                : "border-gray-400"
            }`}
          >
            {todo.completed && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                stroke="white"
                strokeWidth="3"
              >
                <path
                  d="M5 10l3 3 7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <span className="text-sm font-medium">Done</span>
        </button>
      </div>
    </div>
  );
}
