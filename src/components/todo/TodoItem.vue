<script setup lang="ts">
import {
  Activity,
  Calendar,
  CalendarCheck,
  CalendarClock,
  Edit,
  SquareCheck,
  SquareX,
  Trash2,
} from "lucide-vue-next";
import Card from "../ui/card/Card.vue";
import CardContent from "../ui/card/CardContent.vue";
import CardDescription from "../ui/card/CardDescription.vue";
import CardHeader from "../ui/card/CardHeader.vue";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { fetchUserData } from "@/lib/utils";
import { ref } from "vue";
import DialogTrigger from "../ui/dialog/DialogTrigger.vue";
import Dialog from "../ui/dialog/Dialog.vue";
import DialogContent from "../ui/dialog/DialogContent.vue";
import TodoForm from "./TodoForm.vue";
import DialogTitle from "../ui/dialog/DialogTitle.vue";
import DialogDescription from "../ui/dialog/DialogDescription.vue";
import DialogFooter from "../ui/dialog/DialogFooter.vue";
import Button from "../ui/button/Button.vue";
import type { Todo } from "@/types/todo";
import CardFooter from "../ui/card/CardFooter.vue";
import type { User } from "@/types/user";
import { getCurrentTime } from "@/lib/utils";
import CustomLoader from "../loader/CustomLoader.vue";

const isLoading = ref(false);
const isShownEdit = ref(false);
const props = defineProps<{
  task: Todo;
  userId: string;
}>();

const docRef = doc(db, "userData", props.userId);

const editTask = async (values: any) => {
  isLoading.value = true;
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const userData = docSnap.data();
    const todos = userData?.todos || [];
    const updatedTodos = todos.map((task: any) => {
      if (task.id === props.task.id) {
        return {
          ...task,
          ...values,
        };
      }
      return task;
    });
    await updateDoc(docRef, {
      todos: updatedTodos,
    });
    fetchUserData(props.userId);
  }
  isLoading.value = false;
  isShownEdit.value = false;
};

const removeTask = async () => {
  isLoading.value = true;
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const userData = docSnap.data();
    const todos = userData?.todos || [];
    const updatedTodos = todos.filter((task: any) => task.id !== props.task.id);
    await updateDoc(docRef, {
      todos: updatedTodos,
    });
    await fetchUserData(props.userId);
  }
  isLoading.value = false;
};
const finishTaskHandler = async () => {
  isLoading.value = true;
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data() as User;
    const updatedTodos = data.todos.map((todo) => {
      if (todo.id === props.task.id) {
        if (todo.status === "done") {
          return { ...todo, status: "inProgress", finishedAt: null };
        } else {
          return { ...todo, status: "done", finishedAt: getCurrentTime() };
        }
      }
      return todo;
    });
    await updateDoc(docRef, {
      todos: updatedTodos,
    });
    await fetchUserData(props.userId);
  }
  isLoading.value = false;
};
</script>
<template>
  <Card
    :class="`relative flex flex-col rounded-md group/card overflow-hidden border-t-4  ${
      props.task.priority === 'low'
        ? 'border-t-green-600'
        : props.task.priority === 'medium'
        ? 'border-t-yellow-600'
        : props.task.priority === 'high' && 'border-t-red-600'
    }`"
  >
    <CardHeader class="py-5">
      <CardDescription class="flex items-center justify-between gap-4">
        <div>
          <div
            v-if="props.task.status === 'done'"
            class="flex gap-1 items-center"
          >
            <CalendarCheck class="w-4 h-4" /><span>{{
              props.task.finishedAt
            }}</span>
          </div>
          <div v-else class="flex items-center gap-1">
            <Activity class="h-4 w-4" />
            <span>Ongoing</span>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <button
            type="button"
            :disabled="isLoading"
            aria-label="Toggle task status"
            class="group"
            @click="finishTaskHandler"
          >
            <SquareCheck
              v-if="props.task.status === 'inProgress'"
              class="h-5 w-5 group-hover:text-green-600 transition-colors ease-out duration-200"
            />
            <SquareX
              v-else
              class="h-5 w-5 group-hover:text-red-600 transition-colors ease-out duration-200"
            />
          </button>
          <Dialog :open="isShownEdit" @update:open="isShownEdit = false">
            <DialogTrigger as-child>
              <button
                type="button"
                :disabled="isLoading"
                aria-label="Edit task"
                class="group"
                @click="isShownEdit = true"
              >
                <Edit
                  class="h-5 w-5 group-hover:text-green-600 transition-colors ease-out duration-200"
                />
              </button>
            </DialogTrigger>
            <DialogContent
              class="grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]"
            >
              <TodoForm
                :submit-handler="editTask"
                title="Edit task"
                description="Change data in selected task."
                submit-button-text="Finish editing"
                :task-data="props.task"
                :is-loading="isLoading"
              />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger as-child>
              <button
                type="button"
                class="group"
                aria-label="Remove task popup"
              >
                <Trash2
                  class="h-5 w-5 transition-colors ease-out duration-200 group-hover:text-red-600"
                />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Remove task</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove this task?
              </DialogDescription>
              <span>{{ props.task.title }}</span>
              <DialogFooter>
                <Button
                  variant="destructive"
                  aria-label="Remove task"
                  @click="removeTask"
                  :disabled="isLoading"
                >
                  <span v-if="!isLoading">Remove</span><CustomLoader v-else
                /></Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardDescription>
    </CardHeader>
    <CardContent class="flex flex-col flex-grow">
      <h3 class="text-lg font-medium">{{ props.task.title }}</h3>
      <p class="text-zinc-500">{{ props.task.description }}</p>
    </CardContent>
    <CardFooter class="flex flex-col items-stretch gap-2">
      <p class="text-sm text-zinc-600 font-medium">
        {{ props.task.category.text }}
      </p>

      <div class="flex justify-between">
        <div class="text-zinc-400 flex gap-1 items-center">
          <Calendar class="w-4 h-4" />
          <span class="text-sm">{{ props.task.createdAt }}</span>
        </div>
        <div class="text-zinc-400 flex items-center gap-1">
          <CalendarClock class="w-4 h-4" />
          <span class="text-sm">
            {{ props.task.deadline }}
          </span>
        </div>
      </div>
    </CardFooter>
    <div
      class="absolute top-0 left-0 h-full w-full flex items-center justify-center bg-zinc-50 opacity-80 rounded-lg group-hover/card:opacity-0 transition ease-in-out group-hover/card:top-full"
      v-if="props.task.status === 'done'"
    >
      <span class="font-medium">{{
        props.task.finishedAt! > props.task.deadline! ? "Failed" : "Finished"
      }}</span>
    </div>
    <div
      class="absolute top-0 left-0 h-full w-full flex items-center justify-center bg-zinc-50 opacity-80 rounded-lg"
      v-if="isLoading"
    >
      <CustomLoader />
    </div>
  </Card>
</template>
