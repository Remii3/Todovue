<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";
const props = defineProps<{
  type: "screen" | "component";
}>();
</script>

<template>
  <div
    :class="`${
      props.type === 'screen' ? 'h-screen w-screen' : 'h-full w-full'
    } flex items-center justify-center`"
  >
    <Loader2 class="h-6 w-6 animate-spin" />
  </div>
</template>
