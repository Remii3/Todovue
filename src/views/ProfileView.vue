<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import Separator from "@/components/ui/separator/Separator.vue";
import { auth, db } from "@/lib/firebase";
import { useUserStore } from "@/stores/user";
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  signOut,
} from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { Eye, EyeOff, Loader2 } from "lucide-vue-next";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import type { Todo } from "@/types/todo";
import { FirebaseError } from "firebase/app";
import Input from "@/components/ui/input/Input.vue";

const router = useRouter();
const { user, updateUserData } = useUserStore();
const isLoggingOut = ref(false);
const isDeleting = ref(false);
const reauthenticateNeeded = ref(false);
const rePassword = ref("");
const showPassword = ref(false);

const logoutHandler = async () => {
  isLoggingOut.value = true;
  updateUserData(null);
  await signOut(auth);
  router.push({ name: "login" });
  isLoggingOut.value = false;
};

const reauthEmailUser = async () => {
  try {
    if (!auth.currentUser) return;
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email!,
      rePassword.value
    );
    await reauthenticateWithCredential(auth.currentUser, credential);
    reauthenticateNeeded.value = false;
  } catch (error) {
    console.error("Error reauthenticating user:", error);
  }
};

const deleteAccount = async () => {
  isDeleting.value = true;
  if (!auth.currentUser || !user) return;

  if (user) {
    const userId = user.uid;

    try {
      try {
        await deleteDoc(doc(db, "userData", userId));
      } catch (error) {
        console.error("Error deleting user data:", error);
      }
      await deleteUser(auth.currentUser);

      router.push({ name: "register" });
      isDeleting.value = false;
    } catch (error) {
      if (
        error instanceof FirebaseError &&
        error.code === "auth/requires-recent-login"
      ) {
        try {
          const providerId = auth.currentUser.providerData[0].providerId;
          if (providerId === "password") {
            isDeleting.value = false;
            reauthenticateNeeded.value = true;
            return;
          } else if (providerId === "google.com") {
            await reauthenticateWithPopup(
              auth.currentUser,
              new GoogleAuthProvider()
            );
            try {
              await deleteDoc(doc(db, "userData", userId));
            } catch (error) {
              console.error("Error deleting user data:", error);
            }
            await deleteUser(auth.currentUser);

            router.push({ name: "register" });

            isDeleting.value = false;
          } else {
            console.error("Unsupported provider.");
          }
        } catch (reauthError) {
          console.error("Error reauthenticating user:", reauthError);
        }
      } else {
        console.error("Error deleting user account:", error);
      }
    }
  }
};

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
  <div class="w-full h-[calc(100vh-128px)] flex items-center justify-center">
    <div>
      <h2 class="text-3xl font-semibold">Hello</h2>
      <p class="text-lg font-medium mb-8">
        {{ user ? (user.displayName ? user.displayName : user.email) : "" }}
      </p>
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
      <div class="flex gap-4 justify-between">
        <Button
          variant="outline"
          :disabled="isLoggingOut || isDeleting"
          @click="logoutHandler"
          data-cy="logout"
        >
          <span v-if="!isLoggingOut">Logout</span>
          <Loader2 v-else class="h-6 w-6 animate-spin" />
        </Button>
        <Button
          variant="destructive"
          :disabled="isLoggingOut || isDeleting || reauthenticateNeeded"
          @click="deleteAccount"
          data-cy="delete-account"
          ><span v-if="!isDeleting">Delete Account</span
          ><Loader2 v-else class="h-6 w-6 animate-spin"
        /></Button>
      </div>
      <div v-if="reauthenticateNeeded" class="mt-4">
        <p class="mb-2 font-medium">
          To finish deleting your account please verify your identity by
          verifying your password below.
        </p>
        <div class="relative mb-4">
          <Input
            class="pr-10"
            autocomplete="current-password"
            v-model="rePassword"
            placeholder="Password"
            :type="showPassword ? 'text' : 'password'"
          />
          <button
            class="absolute p-2.5 top-0 right-0"
            type="button"
            @click="showPassword = !showPassword"
          >
            <div v-if="showPassword"><Eye class="h-5 w-5" /></div>
            <div v-else><EyeOff class="h-5 w-5" /></div>
          </button>
        </div>
        <Button @click="reauthEmailUser">Verify</Button>
      </div>
    </div>
  </div>
</template>
