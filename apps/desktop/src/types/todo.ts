export type TodoTag = "work" | "study" | "entertainment" | "family";

export interface Todo {
  id: string;
  title: string;
  description: string;
  tags: TodoTag[];
  completed: boolean;
  createdAt: number;
}

export interface TodoFilter {
  tag: TodoTag | null;
  hideDone: boolean;
}
