<script setup lang="ts">
import type { Todo } from "@/types/todo";
import type { User } from "@/types/user";
import { computed } from "vue";
import Separator from "../ui/separator/Separator.vue";
const { user } = defineProps<{ user: User | null }>();
const ongoingTodosQuantity = computed(() => {
  return user
    ? user.todos.filter((todo: Todo) => todo.status === "inProgress").length
    : 0;
});
const doneTodosQuantity = computed(() => {
  return user
    ? user.todos.filter((todo: Todo) => todo.status === "done").length
    : 0;
});
</script>

<template>
  <div class="flex items-center justify-center gap-4 mb-8">
    <div class="flex flex-col gap-1 items-center">
      <span class="font-medium">Todo</span>
      <span>{{ ongoingTodosQuantity }}</span>
    </div>

    <Separator orientation="vertical" class="h-6" />
    <div class="flex flex-col items-center gap-1">
      <span class="font-medium">Finished</span
      ><span>{{ doneTodosQuantity }}</span>
    </div>
    <Separator orientation="vertical" class="h-6" />
    <div class="flex flex-col items-center gap-1">
      <span class="font-medium">All</span
      ><span>{{ user ? user.todos.length : 0 }}</span>
    </div>
  </div>
</template>
