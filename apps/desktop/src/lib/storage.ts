/**
 * Storage Module
 *
 * Handles all localStorage operations for todo data persistence.
 * Provides a simple API for CRUD operations on todos.
 */

import { Todo } from "../types/todo";

const STORAGE_KEY = "toddy_todos";

/**
 * Storage service for managing todo items in browser localStorage
 */
export const storage = {
  /**
   * Retrieves all todos from localStorage
   * @returns Array of todos, or empty array if none found or on error
   */
  getTodos: (): Todo[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading todos:", error);
      return [];
    }
  },

  /**
   * Saves todos array to localStorage
   * @param todos - Array of todos to save
   */
  saveTodos: (todos: Todo[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error("Error saving todos:", error);
    }
  },

  /**
   * Adds a new todo to the list
   * @param todo - The todo object to add
   */
  addTodo: (todo: Todo): void => {
    const todos = storage.getTodos();
    todos.push(todo);
    storage.saveTodos(todos);
  },

  /**
   * Updates an existing todo with new data
   * @param id - The ID of the todo to update
   * @param updates - Partial todo object with fields to update
   */
  updateTodo: (id: string, updates: Partial<Todo>): void => {
    const todos = storage.getTodos();
    const index = todos.findIndex((t) => t.id === id);
    if (index !== -1) {
      todos[index] = { ...todos[index], ...updates };
      storage.saveTodos(todos);
    }
  },

  /**
   * Deletes a todo from the list
   * @param id - The ID of the todo to delete
   */
  deleteTodo: (id: string): void => {
    const todos = storage.getTodos();
    const filtered = todos.filter((t) => t.id !== id);
    storage.saveTodos(filtered);
  },

  /**
   * Toggles the completed status of a todo
   * @param id - The ID of the todo to toggle
   */
  toggleTodo: (id: string): void => {
    const todos = storage.getTodos();
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      storage.saveTodos(todos);
    }
  },
};
