export type Todo = {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  deadline: string | null;
  finishedAt: number | null;
  status: "inProgress" | "done";
  priority: "low" | "medium" | "high";
};
export type NewTodoType = Omit<
  Todo,
  "id" | "completed" | "createdAt" | "finishedAt"
>;
