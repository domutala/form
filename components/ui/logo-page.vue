<script lang="ts" setup>
import pjson from "../../package.json";
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
      <svg-icon class="text-primary" name="logo-text" width="92" height="92" />

      <svg-icon
        style="position: absolute; bottom: 0; left: 0"
        class="text-primary"
        name="logo-motif"
        width="150"
        height="150"
      />

      <div
        style="
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
        "
      >
        {{ $config.dev ? $route.name : `v-${pjson.version}` }}
      </div>
    </div>
  </v-app>
</template>
