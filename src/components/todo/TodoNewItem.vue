<script setup lang="ts">
import { ref } from "vue";
import Dialog from "../ui/dialog/Dialog.vue";
import Button from "../ui/button/Button.vue";
import DialogTrigger from "../ui/dialog/DialogTrigger.vue";
import DialogContent from "../ui/dialog/DialogContent.vue";
import { Plus } from "lucide-vue-next";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { v4 } from "uuid";
import fetchUserData from "@/helpers/fetchUserData";
import TodoForm from "./TodoForm.vue";
import type { Todo } from "@/types/todo";
import { getCurrentTime } from "@/helpers/currentTime";

const shownModal = ref(false);
const isLoading = ref(false);
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const uploadNewTask = async (values: any) => {
  if (!user.value) return;
  isLoading.value = true;
  const docRef = doc(db, "userData", user.value?.uid);
  const docSnap = await getDoc(docRef);

  try {
    const userData = docSnap.data();
    const todos = userData?.todos || [];

    const newTodo = {
      ...values,
      id: v4(),
      status: "inProgress",
      createdAt: getCurrentTime(),
    } as Todo;
    const updatedTodos = [...todos, newTodo];

    await updateDoc(docRef, {
      todos: updatedTodos,
    });
    await fetchUserData(user.value.uid);
    isLoading.value = false;
    shownModal.value = false;
  } catch (err) {
    isLoading.value = false;
    console.log(err);
  }
};
</script>

<template>
  <Dialog :open="shownModal" @update:open="shownModal = false">
    <DialogTrigger as-child>
      <Button
        variant="default"
        @click="shownModal = true"
        aria-label="Add new task"
        class="w-full sm:w-auto"
      >
        <span class="hidden sm:inline-block">Add new task</span>
        <Plus class="w-6 h-6 sm:ml-2"
      /></Button>
    </DialogTrigger>
    <DialogContent
      class="grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]"
    >
      <TodoForm
        :submit-handler="uploadNewTask"
        title="Add new task"
        description="Provide data and create new task."
        submit-button-text="Add new task"
        :is-loading="isLoading"
      />
    </DialogContent>
  </Dialog>
</template>
