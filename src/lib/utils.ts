import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { auth, db } from "@/lib/firebase";
import { useUserStore } from "@/stores/user";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { Todo } from "@/types/todo";
import type { User } from "@/types/user";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getCurrentTime = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month starts from 0
  const day = String(currentDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export async function fetchUserData(userId: string) {
  const { updateUserData } = useUserStore();
  const docRef = doc(db, "userData", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const userData = docSnap.data() as User;
    updateUserData({ ...userData, uid: docSnap.id });
    return { error: null };
  } else {
    try {
      await setDoc(doc(db, "userData", userId), {
        email: auth.currentUser?.email,
        todoCategories: [],
        todos: [],
      });
    } catch (error) {
      console.error("Error creating userData document: ", error);
    }
    return { error: "No such document!" };
  }
}

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
    if (sortBy === "title") {
      const aLower = (aValue as string)?.toLowerCase().replace(/[^a-z]/g, "");
      const bLower = (bValue as string)?.toLowerCase().replace(/[^a-z]/g, "");
      return sortOrder === "Asc"
        ? aLower.localeCompare(bLower)
        : bLower.localeCompare(aLower);
    }
    if (sortOrder === "Asc") {
      return aValue! > bValue! ? 1 : -1;
    } else {
      return aValue! < bValue! ? 1 : -1;
    }
  });
};
