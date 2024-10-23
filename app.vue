<script lang="ts" setup>
import CAppSetter from "~/components/app-setter.vue";
import CAppToast from "~/components/app-toast.vue";

import "dayjs/locale/en";
import "dayjs/locale/fr";

const initing = ref(true);
const appSetter = ref<InstanceType<typeof CAppSetter>>();
const appConfig = useAppConfig();

onMounted(mounted);
async function mounted() {
  initing.value = true;

  try {
    await Store.app.init();
    await appSetter.value?.setter();
  } finally {
    initing.value = false;
  }
}
</script>

<template>
  <NuxtLayout>
    <c-app-setter ref="appSetter" />
    <c-app-toast />
    <nuxt-page />
  </NuxtLayout>
</template>
