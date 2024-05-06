<script setup lang="ts">
import TodoFilters from "./TodoFilters.vue";
import TodoItem from "./TodoItem.vue";
import TodoSearch from "./TodoSearch.vue";
import TodoNewItem from "./TodoNewItem.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { ref } from "vue";
import type { Todo } from "@/types/todo";
import TodoSort from "./TodoSort.vue";
import {
  priorityOptions,
  sortingOptions,
  statusOptions,
} from "../../data/static";
import { sortTasks } from "@/helpers/sortTasks";

const userState = useUserStore();
const searchPrompt = ref("");
const filters = ref({
  priority: priorityOptions[0].key,
  status: statusOptions[1].key,
});
const { user } = storeToRefs(userState);
const sort = ref(sortingOptions[0].key);

const tasksList = computed(() => {
  if (!user.value || !user.value.todos) return [];
  const filteredTasks = user.value.todos.filter((task: Todo) => {
    const matchSearch = task.title
      .toLowerCase()
      .includes(searchPrompt.value.toLowerCase());
    const matchesStatus =
      task.status === filters.value.status || filters.value.status === "all";
    const matchesPriority =
      task.priority === filters.value.priority ||
      filters.value.priority === "all";
    return matchSearch && matchesStatus && matchesPriority;
  });

  return sortTasks(filteredTasks, sort.value);
});
</script>

<template>
  <main class="pt-12">
    <div class="grid grid-cols-4 gap-4">
      <div
        class="col-span-3 sm:col-span-2 col-start-1 sm:col-start-2 row-start-1"
      >
        <TodoSearch v-model:searchPrompt="searchPrompt" />
      </div>
      <div class="col-span-1 col-start-4 row-start-1">
        <TodoNewItem />
      </div>
      <div class="col-span-4 sm:col-span-1 col-start-1 row-start-2">
        <TodoFilters
          v-model:priority="filters.priority"
          v-model:status="filters.status"
        />
      </div>

      <div
        class="col-span-4 sm:col-span-3 col-start-1 sm:col-start-2 row-start-3 sm:row-start-2"
      >
        <div class="w-full flex items-end mb-4">
          <TodoSort v-model:sort="sort" />
        </div>

        <div
          class="grid lg:grid-cols-3 grid-cols-1 sm:grid-cols-2 gap-4"
          v-if="user && user.todos.length > 0"
        >
          <TodoItem
            v-for="task in tasksList"
            :task="task"
            :user-id="user.uid"
            :key="task.id"
          />
        </div>
        <div
          v-else-if="user && user.todos.length <= 0"
          class="text-zinc-600 h-full w-full flex items-center justify-center"
        >
          Add your first task!
        </div>
        <div v-else>
          <p class="text-center text-lg text-zinc-500">No user found.</p>
        </div>
      </div>
    </div>
  </main>
</template>
