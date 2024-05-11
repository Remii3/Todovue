<script setup lang="ts">
import { auth, db } from "@/lib/firebase";
import type { User } from "@/types/user";
import { FirebaseError } from "firebase/app";
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  signOut,
} from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { ref } from "vue";
import { useRouter } from "vue-router";
import Button from "../ui/button/Button.vue";
import CustomLoader from "../loader/CustomLoader.vue";
import Input from "../ui/input/Input.vue";
import { Eye, EyeOff } from "lucide-vue-next";

const { updateUserData, user } = defineProps<{
  user: User | null;
  updateUserData: (data: User | null) => void;
}>();

const router = useRouter();
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
</script>
<template>
  <div class="flex gap-4 justify-between">
    <Button
      variant="outline"
      :disabled="isLoggingOut || isDeleting"
      @click="logoutHandler"
      data-cy="logout"
    >
      <span v-if="!isLoggingOut">Logout</span>
      <CustomLoader v-else />
    </Button>
    <Button
      variant="destructive"
      :disabled="isLoggingOut || isDeleting || reauthenticateNeeded"
      @click="deleteAccount"
      data-cy="delete-account"
      ><span v-if="!isDeleting">Delete Account</span><CustomLoader v-else
    /></Button>
  </div>
  <div v-if="reauthenticateNeeded" class="mt-4">
    <p class="mb-2 font-medium">
      To finish deleting your account please verify your identity by verifying
      your password below.
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
</template>
