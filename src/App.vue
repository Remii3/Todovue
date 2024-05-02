<script setup lang="ts">
import { auth } from "./lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import MainNav from "./components/MainNav.vue";
import MainContainer from "./components/MainContainer.vue";
import { ref } from "vue";
import fetchUserData from "./helpers/fetchUserData";
import { useUserStore } from "./stores/user";
import CustomLoader from "./components/CustomLoader.vue";
import { RouterView, useRouter } from "vue-router";

const isLoading = ref(true);
const { updateUserData } = useUserStore();
const router = useRouter();

onAuthStateChanged(auth, async (userAuth) => {
  if (userAuth) {
    localStorage.setItem("user", userAuth.uid);
    await fetchUserData(userAuth.uid);
  } else {
    localStorage.removeItem("user");
    updateUserData(null);
  }
  isLoading.value = false;
});

router.beforeEach(async (to, from, next) => {
  await getAuth().authStateReady();
  if (
    (to.meta.requiresAuth && !auth.currentUser) ||
    (to.meta.requiresAuth &&
      auth.currentUser &&
      auth.currentUser.uid !== localStorage.getItem("user"))
  ) {
    next({ name: "login" });
  } else {
    next();
  }
});
</script>

<template>
  <CustomLoader v-if="isLoading" :type="'screen'" />
  <MainNav v-if="!isLoading" />
  <MainContainer v-if="!isLoading">
    <RouterView />
  </MainContainer>
</template>
