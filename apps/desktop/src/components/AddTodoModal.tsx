import { useState } from "react";
import { TodoTag } from "../types/todo";
import { TAG_COLORS, TAG_LABELS, ALL_TAGS } from "../constants/tags";

interface AddTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, description: string, tags: TodoTag[]) => void;
}

/**
 * AddTodoModal Component
 *
 * Modal dialog for creating a new todo item with title, description, and tags.
 */
export function AddTodoModal({ isOpen, onClose, onAdd }: AddTodoModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<TodoTag[]>([]);

  if (!isOpen) return null;

  /**
   * Handles form submission and creates a new todo
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title, description, selectedTags);
      setTitle("");
      setDescription("");
      setSelectedTags([]);
      onClose();
    }
  };

  /**
   * Toggles selection of a tag
   */
  const toggleTag = (tag: TodoTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center md:p-4 z-50">
      <div className="bg-white md:rounded-2xl shadow-2xl max-w-2xl w-full h-full md:h-auto p-6 md:p-10 overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header with buttons */}
          <div className="flex justify-between items-center mb-8">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Add
            </button>
          </div>

          {/* Title Input */}
          <div className="mb-8">
            <label htmlFor="todo-title" className="block text-xl font-semibold text-gray-700 mb-3">
              Title
            </label>
            <input
              id="todo-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a title..."
              className="w-full px-0 py-3 border-0 border-b-2 border-gray-200 focus:border-gray-400 focus:outline-none text-gray-600 placeholder-gray-400 bg-transparent"
              required
              autoFocus
            />
          </div>

          {/* Description Input */}
          <div className="mb-8">
            <label htmlFor="todo-description" className="block text-xl font-semibold text-gray-700 mb-3">
              Description
            </label>
            <textarea
              id="todo-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={5}
              className="w-full px-0 py-3 border-0 border-b-2 border-gray-200 focus:border-gray-400 focus:outline-none text-gray-600 placeholder-gray-400 resize-none bg-transparent"
            />
          </div>

          {/* Tags Selection */}
          <div>
            <label className="block text-xl font-semibold text-gray-700 mb-4">
              Tags
            </label>
            <div className="flex flex-wrap gap-3 md:gap-4">
              {ALL_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`flex items-center gap-2 transition-opacity ${
                    selectedTags.includes(tag)
                      ? "opacity-100"
                      : "opacity-40 hover:opacity-60"
                  }`}
                  aria-label={`Toggle ${TAG_LABELS[tag]} tag`}
                >
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${TAG_COLORS[tag]}`} />
                  <span className="text-sm md:text-base text-gray-600 font-medium">{TAG_LABELS[tag]}</span>
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
