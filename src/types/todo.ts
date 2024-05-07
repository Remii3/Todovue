export type Todo = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  deadline: string | null;
  finishedAt: string | null;
  status: "inProgress" | "done";
  priority: "low" | "medium" | "high";
  category: { key: string; text: string };
};
export type NewTodoType = Omit<
  Todo,
  "id" | "completed" | "createdAt" | "finishedAt"
>;
