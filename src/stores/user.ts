import { ref } from "vue";
import { defineStore } from "pinia";
import type { User } from "@/types/user";

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);

  function updateUserData(userData: User | null) {
    user.value = userData;
    return user.value;
  }

  return { user, updateUserData };
});
