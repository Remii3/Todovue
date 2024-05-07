import type { Todo } from "./todo";

export type User = {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  todoCategories: { key: string; text: string }[];
  todos: Todo[];
};
