/**
 * Tag Constants
 *
 * Centralized configuration for todo tags including their colors and labels.
 * This ensures consistency across all components.
 */

import { TodoTag } from "../types/todo";

/**
 * Mapping of todo tags to their corresponding Tailwind CSS background color classes
 */
export const TAG_COLORS: Record<TodoTag, string> = {
  work: "bg-purple-200",
  study: "bg-blue-200",
  entertainment: "bg-red-200",
  family: "bg-green-200",
} as const;

/**
 * Human-readable labels for each tag type
 */
export const TAG_LABELS: Record<TodoTag, string> = {
  work: "Work",
  study: "Study",
  entertainment: "Entertainment",
  family: "Family",
} as const;

/**
 * Array of all available tags for iteration
 */
export const ALL_TAGS = Object.keys(TAG_LABELS) as TodoTag[];
