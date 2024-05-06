import type { Todo } from "@/types/todo";

export const sortTasks = (tasks: Todo[], sorting: string) => {
  if (!tasks || !tasks.length) return [];

  const [sortBy, sortOrder] = sorting.split(", ") as [keyof Todo, string];

  return tasks.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === "priority") {
      const priorityMap: Record<string, string> = {
        low: "1",
        medium: "2",
        high: "3",
      };
      aValue = priorityMap[aValue as string];
      bValue = priorityMap[bValue as string];
    }

    if (sortOrder === "Asc") {
      return aValue! > bValue! ? 1 : -1;
    } else {
      return aValue! < bValue! ? 1 : -1;
    }
  });
};
