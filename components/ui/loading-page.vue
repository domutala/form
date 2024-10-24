<script lang="ts" setup>
const runtimeConfig = useRuntimeConfig();
</script>

<template>
  <v-app>
    <div
      style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1005;
        display: flex;
        align-items: center;
        justify-content: center;
      "
      class="bg-background"
    >
      <v-progress-circular color="dark" indeterminate />

      <div style="position: absolute; bottom: 20px; left: 30px">
        <v-btn
          color="dark"
          size="large"
          variant="text"
          rounded="0"
          target="_blank"
          :to="{ name: 'index' }"
        >
          <template #prepend>
            <svg-icon name="logo" width="32" height="32" />
          </template>
          <div style="font-size: 12px">
            {{ $t("poweredBy") }}
            <div>{{ runtimeConfig.public.appName }}</div>
          </div>
        </v-btn>
      </div>
    </div>
  </v-app>
</template>
