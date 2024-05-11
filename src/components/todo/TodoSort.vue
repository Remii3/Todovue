<script setup lang="ts">
import Label from "../ui/label/Label.vue";
import Select from "../ui/select/Select.vue";
import SelectContent from "../ui/select/SelectContent.vue";
import SelectItem from "../ui/select/SelectItem.vue";
import SelectTrigger from "../ui/select/SelectTrigger.vue";
import SelectValue from "../ui/select/SelectValue.vue";
import { taskSortOptions } from "@/data/static";
const sort = defineModel("sort", {
  type: String,
});
</script>

<template>
  <div class="w-full">
    <Label for="sortSelector">Sort</Label>
    <Select id="sortSelector" v-model="sort">
      <SelectTrigger>
        <SelectValue placeholder="Priority" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          v-for="option in taskSortOptions"
          :value="option.key"
          :key="option.key"
          >{{ option.text }}</SelectItem
        >
      </SelectContent>
    </Select>
  </div>
</template>
