<script setup lang="ts">
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-vue-next";

const props = defineProps<{
  class?: string;
}>();
</script>

<template>
  <Loader2 :class="cn('h-6 w-6 animate-spin', props.class)" />
</template>
