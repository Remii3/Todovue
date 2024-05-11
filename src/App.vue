<script setup lang="ts">
import { auth } from "./lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import MainNav from "./components/MainNav.vue";
import { ref } from "vue";
import { fetchUserData } from "./lib/utils";
import { useUserStore } from "./stores/user";
import { RouterView, useRouter } from "vue-router";
import ScreenLoader from "./components/loader/ScreenLoader.vue";

const isLoading = ref(true);
const { updateUserData } = useUserStore();
const router = useRouter();

onAuthStateChanged(auth, async (userAuth) => {
  if (userAuth) {
    const userId = {
      value: userAuth.uid,
      expiration: new Date().getTime() + 10 * 60 * 1000,
    };
    localStorage.setItem("user", JSON.stringify(userId));
    await fetchUserData(userAuth.uid);
  } else {
    localStorage.removeItem("user");
    updateUserData(null);
  }
  isLoading.value = false;
});

router.beforeEach(async (to, _, next) => {
  await getAuth().authStateReady();

  const parsedUserId = JSON.parse(
    localStorage.getItem("user") ||
      JSON.stringify({ value: null, expiration: 0 })
  );
  if (
    parsedUserId.expiration &&
    new Date().getTime() > parsedUserId.expiration
  ) {
    localStorage.removeItem("user");
    updateUserData(null);
    next({ name: "login" });
  } else if (
    (to.meta.requiresAuth && !auth.currentUser) ||
    (to.meta.requiresAuth &&
      auth.currentUser &&
      auth.currentUser.uid !== parsedUserId.value)
  ) {
    next({ name: "login" });
  } else {
    next();
  }
});
</script>

<template>
  <ScreenLoader v-if="isLoading" type="screen" />
  <MainNav v-if="!isLoading" />
  <RouterView v-if="!isLoading" />
</template>
