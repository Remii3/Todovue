<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import Input from "./ui/input/Input.vue";
import Label from "./ui/label/Label.vue";
import Button from "./ui/button/Button.vue";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import Separator from "./ui/separator/Separator.vue";
import { doc, setDoc } from "firebase/firestore";
import fetchUserData from "@/helpers/fetchUserData";
import CustomLoader from "./CustomLoader.vue";

const { type } = defineProps<{
  type: "login" | "register";
}>();
const email = ref("");
const password = ref("");
const name = ref("");
const router = useRouter();
const isLoading = ref<"form" | "google" | "">("");

const fetchUser = async (userId: string) => {
  try {
    fetchUserData(userId)
      .then(() => {
        router.push({ name: "home" });
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (err) {
    console.log(err);
  }
  isLoading.value = "";
};
const createUserData = async ({
  userId,
  name,
  email,
}: {
  userId: string;
  name: string;
  email: string;
}) => {
  try {
    await setDoc(doc(db, "userData", userId), {
      name,
      email,
      todos: [],
    });
    console.log("UserData document created successfully!");
  } catch (error) {
    console.error("Error creating userData document: ", error);
  }
};
const googleAuthHandler = async () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      isLoading.value = "google";

      return result.user;
    })
    .then(async (user) => {
      if (type === "register") {
        await createUserData({
          userId: user.uid,
          email: user.email || "",
          name: user.displayName || "",
        });
      }
      await fetchUser(user.uid);
      isLoading.value = "";
    })
    .catch((error) => {
      console.error(error);
    });
};
const resetForm = () => {
  email.value = "";
  password.value = "";
  name.value = "";
};
const submitHandler = () => {
  isLoading.value = "form";
  if (type === "login") {
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await fetchUser(user.uid);
        resetForm();
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then(async (userCredential) => {
        const user = userCredential.user;
        createUserData({
          userId: user.uid,
          email: email.value,
          name: name.value,
        });
        await fetchUser(user.uid);
        resetForm();
      })
      .catch((error) => {
        console.error(error);
      });
  }
};
</script>

<template>
  <main class="h-screen -mt-16 flex items-center justify-center">
    <form class="sm:mb-24" @submit.prevent="submitHandler">
      <legend class="text-4xl font-medium">
        {{
          type === "login"
            ? "Good to see you again!"
            : "Nice to see a new face!"
        }}
      </legend>
      <div class="space-y-4 mt-8">
        <div>
          <Button
            type="button"
            variant="outline"
            class="w-full text-start"
            @click="googleAuthHandler"
            :disabled="isLoading === 'google'"
            ><span v-if="isLoading !== 'google'" class="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 48 48"
                class="h-6 w-6 mr-2"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                ></path>
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                ></path>
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>
              {{
                type === "login" ? "Login with Google" : "Register with Google"
              }}
            </span>
            <CustomLoader type="component" v-else />
          </Button>
        </div>
        <Separator />
        <div>
          <Label for="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            v-model="email"
            required
            :disabled="isLoading === 'form'"
          />
        </div>
        <div v-if="type === 'register'">
          <Label for="name">Name</Label>
          <Input id="name" type="text" name="name" v-model="name" required />
        </div>
        <div>
          <Label for="password">Password</Label>
          <Input
            id="password"
            type="password"
            name="password"
            v-model="password"
            required
            :disabled="isLoading === 'form'"
          />
        </div>
        <div>
          <Button type="submit" :disabled="isLoading === 'form'">
            <span v-if="isLoading !== 'form'">
              {{ type === "login" ? "Login" : "Register" }}
            </span>
            <CustomLoader type="component" v-else />
          </Button>
        </div>
      </div>

      <div class="text-center mt-6">
        <RouterLink
          class="text-sm text-green-600 font-medium"
          :to="{ name: type === 'login' ? 'register' : 'login' }"
          >{{
            type === "login"
              ? "No account yet? Click here!"
              : "Already a user? Press here!"
          }}</RouterLink
        >
      </div>
    </form>
  </main>
</template>
