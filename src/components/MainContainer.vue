<script setup lang="ts">
import { cn } from "@/lib/utils";

const props = defineProps<{
  withHeight?: boolean;
  class?: string;
}>();
</script>

<template>
  <main
    :class="
      cn(
        `${
          props.withHeight
            ? 'h-[calc(100vh-32px-64px)] sm:h-[calc(100vh-64px-64px)]'
            : ''
        } max-w-screen-xl mx-auto px-4 mb-16 mt-8 sm:mt-16`,
        props.class
      )
    "
  >
    <slot />
  </main>
</template>
