<script setup lang="ts">
import AuthForm from "@/components/AuthForm.vue";
import MainContainer from "@/components/MainContainer.vue";
</script>
<template>
  <MainContainer with-height class="flex items-center justify-center">
    <h1 class="sr-only">SignUp</h1>
    <AuthForm type="register" />
  </MainContainer>
</template>
