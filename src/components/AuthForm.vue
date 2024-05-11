<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import Input from "./ui/input/Input.vue";
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
import { fetchUserData } from "@/lib/utils";
import CustomLoader from "@/components/loader/CustomLoader.vue";
import { Eye, EyeOff } from "lucide-vue-next";
import { useForm } from "vee-validate";
import * as z from "zod";
import {
  FormField,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { toTypedSchema } from "@vee-validate/zod";

const { type } = defineProps<{
  type: "login" | "register";
}>();
const showPassword = ref(false);
const router = useRouter();
const isLoading = ref<"form" | "google" | "">("");
const errorMessage = ref("");

const authSchema = toTypedSchema(
  z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long." }),
  })
);

const { handleSubmit, resetForm } = useForm({
  validationSchema: authSchema,
  initialValues: {
    email: "",
    password: "",
  },
});

const fetchUser = async (userId: string) => {
  try {
    await fetchUserData(userId);
  } catch (error) {
    console.error("Error fetching user data: ", error);
    errorMessage.value = "An error occurred. Please try again.";
    isLoading.value = "";
    return;
  }
  router.push({ name: "home" });
  isLoading.value = "";
};

const createUserData = async ({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) => {
  try {
    await setDoc(doc(db, "userData", userId), {
      email,
      todos: [],
      todoCategories: [],
    });
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
        });
      }
      await fetchUser(user.uid);
      isLoading.value = "";
    })
    .catch((error) => {
      console.error(error.message);
    });
};

const submitHandler = handleSubmit((values) => {
  isLoading.value = "form";
  if (type === "login") {
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await fetchUser(user.uid);
        resetForm();
      })
      .catch((error) => {
        console.error(error.message);
      });
  } else {
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        createUserData({
          userId: user.uid,
          email: values.email,
        });
        await fetchUser(user.uid);
        resetForm();
      })
      .catch((error) => {
        console.error(error);
        errorMessage.value = error.message;
        isLoading.value = "";
      });
  }
});
</script>

<template>
  <form class="sm:mb-24" @submit="submitHandler">
    <legend class="text-4xl font-medium">
      {{
        type === "login" ? "Good to see you again!" : "Nice to see a new face!"
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
          <CustomLoader v-else />
        </Button>
      </div>
      <Separator />
      <FormField name="email" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input
              placeholder="Email..."
              v-bind="componentField"
              :disabled="isLoading === 'form'"
              autocomplete="email"
              data-cy="email"
            />
          </FormControl>
          <FormDescription>
            We'll never share your email with anyone else.
          </FormDescription>
          <FormMessage data-cy="error-email" />
        </FormItem>
      </FormField>
      <FormField name="password" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <div class="w-full relative">
              <Input
                :type="showPassword ? 'text' : 'password'"
                v-bind="componentField"
                :disabled="isLoading === 'form'"
                placeholder="Password..."
                autocomplete="current-password"
                data-cy="password"
              />
              <button
                class="absolute top-0 right-0 p-2.5"
                type="button"
                @click="showPassword = !showPassword"
              >
                <div v-if="showPassword">
                  <Eye class="h-5 w-5" />
                </div>
                <div v-else>
                  <EyeOff class="h-5 w-5" />
                </div>
              </button>
            </div>
          </FormControl>
          <FormDescription>
            Please provide a password with at least 6 characters.
          </FormDescription>
          <FormMessage data-cy="error-password" />
        </FormItem>
      </FormField>

      <div>
        <Button data-cy="submit" type="submit" :disabled="isLoading === 'form'">
          <span v-if="isLoading !== 'form'">
            {{ type === "login" ? "Login" : "Register" }}
          </span>
          <CustomLoader type="component" v-else />
        </Button>
      </div>
      <div
        v-if="errorMessage"
        class="text-red-600 text-sm font-medium text-center"
      >
        {{ errorMessage }}
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
</template>
