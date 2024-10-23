<script setup lang="ts">
const { login } = useAuth();

async function submit(provider: "github" | "google") {
  try {
    await login(provider);
    useRouter().replace({ name: "dashboard" });
  } catch (error) {}
}
</script>

<template>
  <div
    style="
      margin: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    "
  >
    <v-btn
      @click="submit('github')"
      size="x-large"
      variant="text"
      color="dark"
      class="border"
      rounded
      block
    >
      <template #prepend>
        <i class="fi fi-brands-github" style="font-size: 24px"></i>
      </template>
      Sign in with Github
    </v-btn>
    <v-btn
      @click="submit('google')"
      size="x-large"
      variant="text"
      color="dark"
      class="border"
      rounded
      block
    >
      <template #prepend>
        <i class="fi fi-brands-google" style="font-size: 24px"></i>
      </template>
      Sign in with Google
    </v-btn>
  </div>
</template>
