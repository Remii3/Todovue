<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { computed, ref } from "vue";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { toDate } from "radix-vue/date";
import {
  DateFormatter,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date";
import DialogTitle from "../ui/dialog/DialogTitle.vue";
import DialogDescription from "../ui/dialog/DialogDescription.vue";
import { FormField } from "../ui/form";
import FormItem from "../ui/form/FormItem.vue";
import FormLabel from "../ui/form/FormLabel.vue";
import FormControl from "../ui/form/FormControl.vue";
import Input from "../ui/input/Input.vue";
import FormDescription from "../ui/form/FormDescription.vue";
import FormMessage from "../ui/form/FormMessage.vue";
import Popover from "../ui/popover/Popover.vue";
import PopoverTrigger from "../ui/popover/PopoverTrigger.vue";
import Button from "../ui/button/Button.vue";
import { CalendarIcon, Loader2, Plus, Trash2 } from "lucide-vue-next";
import PopoverContent from "../ui/popover/PopoverContent.vue";
import Calendar from "../ui/calendar/Calendar.vue";
import type { Todo } from "@/types/todo";
import DialogFooter from "../ui/dialog/DialogFooter.vue";
import Select from "../ui/select/Select.vue";
import SelectTrigger from "../ui/select/SelectTrigger.vue";
import SelectContent from "../ui/select/SelectContent.vue";
import SelectValue from "../ui/select/SelectValue.vue";
import SelectItem from "../ui/select/SelectItem.vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import fetchUserData from "@/helpers/fetchUserData";
import Textarea from "../ui/textarea/Textarea.vue";
const userState = useUserStore();
const { user } = storeToRefs(userState);
const formSchema = toTypedSchema(
  z.object({
    title: z.string(),
    description: z.string(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    category: z.string().optional(),
    deadline: z.string().optional(),
  })
);
const newCategory = ref("");
const isAddingNewCategory = ref(false);
const isRemovingCategory = ref(false);
const props = defineProps<{
  submitHandler: (values: any) => void;
  title: string;
  description: string;
  submitButtonText: string;
  taskData?: Pick<
    Todo,
    "title" | "description" | "deadline" | "priority" | "category"
  >;
  isLoading: boolean;
}>();

const { values, handleSubmit, setValues, setFieldError, resetField } = useForm({
  validationSchema: formSchema,
  initialValues: props.taskData
    ? {
        title: props.taskData.title,
        description: props.taskData.description,
        deadline: props.taskData.deadline!,
        priority: props.taskData.priority,
        category: props.taskData.category.key,
      }
    : {
        title: "",
        description: "",
        deadline: "",
      },
});

const placeholder = ref();
const df = new DateFormatter("en-US", {
  dateStyle: "long",
});
const value = computed({
  get: () => (values.deadline ? parseDate(values.deadline) : undefined),
  set: (val) => val,
});
const prepareCategory = (category: string) => {
  return {
    key: category.toLocaleLowerCase().replace(/\s+/g, "-"),
    text: category,
  };
};

const formSubmitHandler = handleSubmit((values) => {
  let hasErrors = false;
  if (values.title.trim().length === 0) {
    setFieldError("title", "Please type some Title.");
    hasErrors = true;
  }
  if (!values.deadline || values.deadline.trim().length === 0) {
    setFieldError("deadline", "Please choose a deadline.");
    hasErrors = true;
  }
  if (!values.priority || values.priority.trim().length === 0) {
    setFieldError("priority", "Please choose a priority.");
    hasErrors = true;
  }
  if (!values.category || values.category.trim().length === 0) {
    setFieldError("category", "Please choose a category.");
    hasErrors = true;
  }
  if (hasErrors) return;
  const preparedCategory = user.value?.todoCategories.find(
    (category: { key: string; text: string }) =>
      category.key === values.category
  );
  const preparedValues = {
    ...values,
    category: prepareCategory(preparedCategory.text),
  };
  props.submitHandler(preparedValues);
});

const addNewCategoryHandler = async () => {
  if (newCategory.value.trim().length === 0 || !user.value) return;
  isAddingNewCategory.value = true;
  const docRef = doc(db, "userData", user.value.uid);
  await updateDoc(docRef, {
    ...user.value,
    todoCategories: [
      ...user.value.todoCategories,
      prepareCategory(newCategory.value),
    ],
  });
  await fetchUserData(user.value.uid);
  isAddingNewCategory.value = false;
  newCategory.value = "";
};
const removeCategory = async (selectedCategory: {
  key: string;
  text: string;
}) => {
  if (!user.value) return;
  if (selectedCategory.key === values.category?.trim()) {
    resetField("category");
  }

  isRemovingCategory.value = true;
  const docRef = doc(db, "userData", user.value.uid);
  await updateDoc(docRef, {
    ...user.value,
    todoCategories: user.value.todoCategories.filter(
      (category: { key: string; text: string }) =>
        category.key !== selectedCategory.key
    ),
  });
  await fetchUserData(user.value.uid);
  isRemovingCategory.value = false;
};
</script>

<template>
  <DialogTitle>{{ props.title }}</DialogTitle>
  <DialogDescription>{{ props.description }}</DialogDescription>
  <form @submit="formSubmitHandler">
    <FormField name="title" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Title</FormLabel>
        <FormControl>
          <Input
            :disabled="isLoading"
            type="text"
            placeholder="Title..."
            v-bind="componentField"
          />
        </FormControl>
        <FormDescription>The primary title of your task.</FormDescription>
        <FormMessage /> </FormItem
    ></FormField>
    <FormField name="description" v-slot="{ componentField }">
      <FormItem class="mt-4">
        <FormLabel>Description</FormLabel>
        <FormControl>
          <Textarea
            :disabled="isLoading"
            placeholder="Description..."
            v-bind="componentField"
            rows="4"
            class="resize-none"
          />
        </FormControl>
        <FormDescription>The description of your task.</FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField name="category" v-slot="{ componentField }">
      <FormItem class="mt-4">
        <FormLabel>Category</FormLabel>
        <FormControl>
          <Select v-bind="componentField" :disabled="isLoading">
            <SelectTrigger>
              <SelectValue placeholder="Select a category"
            /></SelectTrigger>
            <SelectContent>
              <div class="flex gap-4 m-2">
                <Input
                  type="text"
                  placeholder="Add new category..."
                  v-model="newCategory"
                />
                <Button
                  type="button"
                  :disabled="
                    newCategory.trim().length === 0 || isAddingNewCategory
                  "
                  @click="addNewCategoryHandler"
                >
                  <span v-if="!isAddingNewCategory"
                    ><Plus class="w-6 h-6"
                  /></span>
                  <Loader2 v-else class="w-6 h-6 animate-spin" />
                </Button>
              </div>
              <div
                v-for="category in user?.todoCategories || []"
                :key="category.key"
                class="relative"
              >
                <SelectItem :value="category.key"
                  >{{ category.text }}
                </SelectItem>
                <button
                  class="absolute top-0 right-0 p-2"
                  type="button"
                  :disabled="isRemovingCategory || isAddingNewCategory"
                  @click="removeCategory(category)"
                >
                  <Trash2 class="h-5 w-5" />
                </button>
              </div>

              <SelectItem
                v-if="
                  !user ||
                  !user.todoCategories ||
                  user.todoCategories.length <= 0
                "
                disabled
                aria-readonly="true"
                value="no-category"
                >No category</SelectItem
              >
            </SelectContent>
          </Select>
        </FormControl>
        <FormDescription>The priority of your task.</FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField name="priority" v-slot="{ componentField }">
      <FormItem class="mt-4">
        <FormLabel>Priority</FormLabel>
        <FormControl>
          <Select v-bind="componentField" :disabled="isLoading">
            <SelectTrigger>
              <SelectValue placeholder="Select a priority"
            /></SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </FormControl>
        <FormDescription>The priority of your task.</FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField name="deadline">
      <FormItem class="mt-4">
        <FormLabel>Deadline</FormLabel>
        <Popover>
          <PopoverTrigger as-child>
            <FormControl class="flex">
              <Button
                variant="outline"
                :disabled="isLoading"
                :class="
                  cn(
                    'w-[240px] ps-3 text-start font-normal',
                    !value && 'text-muted-foreground'
                  )
                "
              >
                <span>{{
                  value ? df.format(toDate(value)) : "Pick a date"
                }}</span>
                <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
              </Button>
              <input hidden />
            </FormControl>
            <FormDescription>The deadline for your task.</FormDescription>
            <FormMessage />
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0">
            <Calendar
              v-model:placeholder="placeholder"
              v-model="value"
              calendar-label="Date of birth"
              initial-focus
              :min-value="today(getLocalTimeZone())"
              @update:model-value="
                    (v:any) => {
                      if (v) {
                        setValues({
                          deadline: v.toString(),
                        });
                      } else {
                        setValues({
                          deadline: '',
                        });
                      }
                    }
                  "
            />
          </PopoverContent>
        </Popover>
      </FormItem>
    </FormField>
    <DialogFooter>
      <Button type="submit" :disabled="isLoading" class="mt-4">
        <span v-if="!isLoading"> {{ props.submitButtonText }} </span>
        <Loader2 v-else class="w-6 h-6 animate-spin" />
      </Button>
    </DialogFooter>
  </form>
</template>
