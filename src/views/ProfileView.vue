<script setup>
import Button from "@/components/ui/button/Button.vue";
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
    <Button variant="destructive" type="button" @click="logoutHandler"
      >Logout</Button
    >
  </div>
</template>
