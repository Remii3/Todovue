<script setup>
import { auth } from "@/lib/firebase";
import { useUserStore } from "@/stores/user";
import { signOut } from "firebase/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();

const logoutHandler = async () => {
  userStore.updateUserData(null);
  await signOut(auth);
  router.push({ name: "login" });
};
</script>

<template>
  <div>
    <button type="button" @click="logoutHandler">Logout</button>
  </div>
</template>
