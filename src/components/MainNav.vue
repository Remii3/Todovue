<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { Rainbow, User } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { RouterLink } from "vue-router";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

let routerLinks = ref(
  user.value
    ? [
        { to: "/about", text: "About" },
        { to: "/profile", text: "User" },
      ]
    : [{ to: "/about", text: "About" }]
);

watch(user, (newUser) => {
  if (newUser) {
    routerLinks.value = [
      { to: "/about", text: "About" },
      { to: "/profile", text: "User" },
    ];
  } else {
    routerLinks.value = [{ to: "/about", text: "About" }];
  }
});
</script>

<template>
  <div class="shadow-sm bg-background z-10 fixed top-0 w-full">
    <nav class="max-w-screen-xl mx-auto px-4 flex justify-between items-center">
      <RouterLink to="/" class="flex items-center gap-1 py-1 px-3">
        <Rainbow class="h-9 w-9 text-green-600" />
        <h1 class="text-2xl font-medium">Todovue</h1>
      </RouterLink>
      <ul class="flex items-center">
        <li v-for="(link, index) in routerLinks" :key="index">
          <RouterLink
            :to="link.to"
            class="pt-4 pb-3 px-3 border-b-2 border-b-transparent block"
            active-class="border-b-green-600"
          >
            <div v-if="link.text === 'User'">
              <User class="h-6 w-6" />
            </div>
            <span v-else>{{ link.text }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </div>
</template>
