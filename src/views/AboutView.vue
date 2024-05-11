<script setup lang="ts">
import MainContainer from "@/components/MainContainer.vue";
</script>

<template>
  <MainContainer>
    <section class="max-w-screen-lg mx-auto mt-20 sm:mt-44">
      <h1 class="text-5xl mb-4 font-semibold">About Todovue</h1>
      <p class="text-xl sm:w-1/2 mb-12">
        Welcome to the ToDo App! This application is designed to help you manage
        your tasks more effectively. Whether you're organizing your daily
        schedule or planning long-term projects, our ToDo App has got you
        covered.
      </p>
      <div class="flex flex-col sm:flex-row gap-8 mb-12">
        <p class="text-lg w-full text-justify">
          With our user-friendly interface, you can easily add, edit, and
          prioritize tasks. You can also set deadlines to stay on track and
          never miss an important deadline again.
        </p>
        <p class="text-lg w-full text-justify">
          Our mission is to simplify task management and boost productivity.
          Sign up now and experience the difference with our ToDo App!
        </p>
      </div>
      <h3 class="text-2xl font-medium mb-4">Key Features:</h3>
      <ul class="list-disc pl-4 space-y-1 mb-4">
        <li class="">
          <strong>Task Management:</strong> Create, edit, and delete tasks with
          ease.
        </li>
        <li>
          <strong>Priority Levels:</strong> Assign priority levels (low, medium,
          high) to tasks for better organization.
        </li>
        <li>
          <strong>Deadline Tracking:</strong> Set deadlines for tasks and
          receive reminders to stay focused.
        </li>
        <li>
          <strong>Filtering and Sorting:</strong> Filter tasks by priority or
          status, and sort them based on various criteria.
        </li>
        <li>
          <strong>Search Functionality:</strong> Search for specific tasks using
          keywords or phrases.
        </li>
        <li>
          <strong>User Authentication:</strong> Secure user authentication
          system to protect your data.
        </li>
        <li>
          <strong>Responsive Design:</strong> Access the ToDo App from any
          device, including desktops, tablets, and smartphones.
        </li>
      </ul>
    </section>
  </MainContainer>
</template>
