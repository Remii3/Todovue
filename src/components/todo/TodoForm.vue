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
import { CalendarIcon, Loader2 } from "lucide-vue-next";
import PopoverContent from "../ui/popover/PopoverContent.vue";
import Calendar from "../ui/calendar/Calendar.vue";
import type { Todo } from "@/types/todo";
import DialogFooter from "../ui/dialog/DialogFooter.vue";
import Select from "../ui/select/Select.vue";
import SelectTrigger from "../ui/select/SelectTrigger.vue";
import SelectContent from "../ui/select/SelectContent.vue";
import SelectValue from "../ui/select/SelectValue.vue";
import SelectItem from "../ui/select/SelectItem.vue";

const formSchema = toTypedSchema(
  z.object({
    title: z
      .string({ message: "Please provide a title." })
      .min(1, { message: "Minimum title length is 1 character." }),
    description: z.string().optional(),
    priority: z.enum(["low", "medium", "high"], {
      message: "Please choose a suitable priority level.",
    }),
    deadline: z
      .string({ message: "Please choose a deadline." })
      .refine((v) => v, { message: "A deadline date is required." }),
  })
);

const props = defineProps<{
  submitHandler: (values: any) => void;
  title: string;
  description: string;
  submitButtonText: string;
  taskData?: Pick<Todo, "title" | "description" | "deadline" | "priority">;
  isLoading: boolean;
}>();

const { values, handleSubmit, setValues } = useForm({
  validationSchema: formSchema,
  initialValues: props.taskData
    ? {
        title: props.taskData.title,
        description: props.taskData.description,
        deadline: props.taskData.deadline!,
        priority: props.taskData.priority,
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

const formSubmitHandler = handleSubmit(async (values) => {
  props.submitHandler(values);
});
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
          <Input
            :disabled="isLoading"
            type="text"
            placeholder="Description..."
            v-bind="componentField"
          />
        </FormControl>
        <FormDescription>The description of your task.</FormDescription>
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
