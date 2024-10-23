<script lang="ts" setup>
import type { Options } from "~/form";

const fetching = ref(false);
const model = ref<Options>();

onMounted(mounted);
async function mounted() {
  const route = useRoute();

  try {
    fetching.value = true;
    model.value = await Api.fetch({ url: `/model/${route.params.id}` });
  } finally {
    fetching.value = false;
  }
}
</script>

<template>
  <ui-loading-page v-if="fetching" />

  <v-app v-else-if="model">
    <v-app-bar color="background" elevation="0" border :title="model.title">
    </v-app-bar>

    <v-main>
      <form-model-form
        :model="model"
        style="width: 662px; max-width: 90%; margin: 50px auto"
      />
    </v-main>
  </v-app>

  <v-app v-else>
    <div class="d-flex align-center justify-center" style="margin-top: 200px">
      <i class="fi fi-tr-404" style="font-size: 92px; opacity: 0.3"></i>
    </div>
  </v-app>
</template>
