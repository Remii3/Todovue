<script setup lang="ts">
import Label from "../ui/label/Label.vue";
import Select from "../ui/select/Select.vue";
import SelectContent from "../ui/select/SelectContent.vue";
import SelectItem from "../ui/select/SelectItem.vue";
import SelectTrigger from "../ui/select/SelectTrigger.vue";
import SelectValue from "../ui/select/SelectValue.vue";

const priority = defineModel("priority", {
  type: String,
  default: "all",
});
const status = defineModel("status", {
  type: String,
  default: "all",
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
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
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
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="inProgress">Ongoing</SelectItem>
          <SelectItem value="done">Done</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>
