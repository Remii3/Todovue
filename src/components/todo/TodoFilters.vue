<script setup lang="ts">
import Label from "../ui/label/Label.vue";
import Select from "../ui/select/Select.vue";
import SelectContent from "../ui/select/SelectContent.vue";
import SelectItem from "../ui/select/SelectItem.vue";
import SelectTrigger from "../ui/select/SelectTrigger.vue";
import SelectValue from "../ui/select/SelectValue.vue";
import { taskPriorityOptions, taskStatusOptions } from "../../data/static";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import type { Todo } from "@/types/todo";
const userState = useUserStore();
const { user } = storeToRefs(userState);
const priority = defineModel("priority", {
  type: String,
});
const status = defineModel("status", {
  type: String,
});
const category = defineModel("category", {
  type: String,
});
const tasksCategories = computed(() => {
  if (!user.value || !user.value.todos) return [];
  return user.value.todos.reduce(
    (acc: { key: string; text: string }[], task: Todo) => {
      if (!acc.some((category) => category.key === task.category.key)) {
        acc.push(task.category);
      }
      return acc;
    },
    []
  );
});
</script>
<template>
  <div class="flex gap-4 flex-row sm:flex-col justify-center">
    <div class="w-full">
      <Label for="prioritySelector">Priority</Label>
      <Select id="prioritySelector" v-model="priority">
        <SelectTrigger>
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="option in taskPriorityOptions"
            :value="option.key"
            :key="option.key"
            >{{ option.text }}</SelectItem
          >
        </SelectContent>
      </Select>
    </div>
    <div class="w-full">
      <Label for="statusSelector">Status</Label>
      <Select id="statusSelector" v-model="status">
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="option in taskStatusOptions"
            :value="option.key"
            :key="option.key"
            >{{ option.text }}</SelectItem
          >
        </SelectContent>
      </Select>
    </div>
    <div class="w-full">
      <Label for="categorySelector">Category</Label>
      <Select id="categorySelector" v-model="category">
        <SelectTrigger>
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem
            v-for="option in tasksCategories"
            :value="option.key"
            :key="option.key"
            >{{ option.text }}</SelectItem
          >
        </SelectContent>
      </Select>
    </div>
  </div>
</template>
