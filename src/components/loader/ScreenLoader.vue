<script setup lang="ts">
import CustomLoader from "./CustomLoader.vue";
const props = defineProps<{ type: "screen" | "screenNav" }>();
</script>

<template>
  <div
    :class="`${
      props.type === 'screenNav' ? 'h-[calc(100vh-44px)]' : 'h-screen'
    } w-screen flex items-center justify-center`"
  >
    <CustomLoader />
  </div>
</template>
