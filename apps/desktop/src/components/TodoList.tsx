import { useState, useEffect } from "react";
import { Todo, TodoTag } from "../types/todo";
import { storage } from "../lib/storage";
import { AddTodoModal } from "./AddTodoModal";
import { EditTodoModal } from "./EditTodoModal";
import { TodoCard } from "./TodoCard";
import { SidebarCharacter } from "./SidebarCharacter";
import { TAG_COLORS, TAG_LABELS, ALL_TAGS } from "../constants/tags";

/**
 * TodoList Component
 *
 * Main component that displays and manages the todo list interface.
 * Includes filtering by tags, hiding completed tasks, and CRUD operations.
 */
export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [selectedTag, setSelectedTag] = useState<TodoTag | null>(null);
  const [hideDone, setHideDone] = useState(false);

  /**
   * Load todos from storage on component mount
   */
  useEffect(() => {
    setTodos(storage.getTodos());
  }, []);

  /**
   * Adds a new todo to the list
   */
  const handleAddTodo = (title: string, description: string, tags: TodoTag[]) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      description,
      tags,
      completed: false,
      createdAt: Date.now(),
    };
    storage.addTodo(newTodo);
    setTodos(storage.getTodos());
  };

  /**
   * Opens the edit modal for a specific todo
   */
  const handleEditTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      setEditingTodo(todo);
      setIsEditModalOpen(true);
    }
  };

  /**
   * Saves changes to an edited todo
   */
  const handleSaveEdit = (id: string, title: string, description: string, tags: TodoTag[]) => {
    storage.updateTodo(id, { title, description, tags });
    setTodos(storage.getTodos());
    setIsEditModalOpen(false);
    setEditingTodo(null);
  };

  /**
   * Toggles the completed status of a todo
   */
  const handleToggleTodo = (id: string) => {
    storage.toggleTodo(id);
    setTodos(storage.getTodos());
  };

  /**
   * Deletes a todo from the list
   */
  const handleDeleteTodo = (id: string) => {
    storage.deleteTodo(id);
    setTodos(storage.getTodos());
  };

  /**
   * Filter todos based on selected tag and hide done setting
   */
  const filteredTodos = todos.filter((todo) => {
    if (selectedTag && !todo.tags.includes(selectedTag)) return false;
    if (hideDone && todo.completed) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">todo</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 text-2xl md:text-3xl font-light transition-colors"
          >
            +
          </button>
        </div>

        {/* Mobile - Horizontal Tags */}
        <div className="lg:hidden mb-6">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  selectedTag === tag
                    ? "bg-gray-200"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                <div className={`w-6 h-6 rounded-full ${TAG_COLORS[tag]}`} />
                <span className="text-sm font-medium text-gray-700">
                  {TAG_LABELS[tag]}
                </span>
              </button>
            ))}
          </div>

          {/* Hide Done Tasks Toggle - Mobile */}
          <label className="flex items-center gap-2 mt-3">
            <div
              className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                hideDone
                  ? "bg-gray-700 border-gray-700"
                  : "border-gray-400"
              }`}
            >
              {hideDone && (
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
            <input
              type="checkbox"
              checked={hideDone}
              onChange={(e) => setHideDone(e.target.checked)}
              className="sr-only"
            />
            <span className="text-gray-500 text-sm">Hide Done Tasks</span>
          </label>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar - Categories */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="space-y-3">
              {ALL_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    selectedTag === tag
                      ? "bg-gray-200"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${TAG_COLORS[tag]}`} />
                  <span className="text-gray-700 font-medium">
                    {TAG_LABELS[tag]}
                  </span>
                </button>
              ))}

              {/* Hide Done Tasks Toggle */}
              <label className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors">
                <div
                  className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                    hideDone
                      ? "bg-gray-700 border-gray-700"
                      : "border-gray-400"
                  }`}
                >
                  {hideDone && (
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
                <input
                  type="checkbox"
                  checked={hideDone}
                  onChange={(e) => setHideDone(e.target.checked)}
                  className="sr-only"
                />
                <span className="text-gray-500 text-sm">Hide Done Tasks</span>
              </label>
            </div>

            {/* Character illustration */}
            <SidebarCharacter />
          </div>

          {/* Main Content - Todo Grid */}
          <div className="flex-1">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg">
                  {selectedTag
                    ? `No tasks in ${TAG_LABELS[selectedTag]} category`
                    : "No tasks yet. Click + to add your first task!"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredTodos.map((todo) => (
                  <TodoCard
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggleTodo}
                    onDelete={handleDeleteTodo}
                    onEdit={handleEditTodo}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Todo Modal */}
      <AddTodoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTodo}
      />

      {/* Edit Todo Modal */}
      <EditTodoModal
        isOpen={isEditModalOpen}
        todo={editingTodo}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTodo(null);
        }}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
