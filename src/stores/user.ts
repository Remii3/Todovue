import { ref } from "vue";
import { defineStore } from "pinia";
import type { User } from "@/types/user";
import type { DocumentData } from "firebase/firestore";

export const useUserStore = defineStore("user", () => {
  const user = ref<User | DocumentData | null>(null);

  function updateUserData(userData: User | DocumentData | null) {
    user.value = userData;
    return user.value;
  }

  return { user, updateUserData };
});
