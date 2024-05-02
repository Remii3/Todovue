<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
</script>

<template>
  <main>
    <h1 class="text-4xl text-center">Welcome to the Home Page</h1>
    <p class="text-center">This is the home page of the app</p>
    <p class="text-center">
      User: <span class="text-red-500">{{ user?.email }}</span>
    </p>
  </main>
</template>
