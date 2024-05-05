<script setup lang="ts">
import Input from "../ui/input/Input.vue";
const searchModel = defineModel("searchPrompt", {
  type: String,
  default: "",
});
</script>
<template>
  <div>
    <Input
      type="text"
      v-model:model-value="searchModel"
      placeholder="Search a title..."
    />
  </div>
</template>
