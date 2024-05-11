<script setup lang="ts">
import { useUserStore } from "@/stores/user";

import MainContainer from "@/components/MainContainer.vue";
import UserStats from "@/components/profile/UserStats.vue";
import UserActions from "@/components/profile/UserActions.vue";
const { user, updateUserData } = useUserStore();
</script>

<template>
  <MainContainer with-height class="flex items-center justify-center pb-12">
    <div>
      <h1 class="sr-only">Profile</h1>
      <h2 class="text-3xl font-semibold">Hello</h2>
      <p class="text-lg font-medium mb-8">
        {{ user ? (user.displayName ? user.displayName : user.email) : "" }}
      </p>
      <UserStats :user="user" />
      <UserActions :user="user" :update-user-data="updateUserData" />
    </div>
  </MainContainer>
</template>
