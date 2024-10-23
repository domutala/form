<script lang="ts" setup>
import type { CSSProperties } from "vue";
import type { Schema } from "~/form/interfaces/Schema";

const props = defineProps({
  schema: { type: Object as PropType<Schema>, required: true },
});

const style = computed(() => {
  let style: CSSProperties = {};
  if (props.schema.interface.style) {
    style = { ...props.schema.interface.style };
  }

  if (typeof props.schema.interface.fontSize !== "undefined") {
    style.fontSize = `${props.schema.interface.fontSize}px`;
  }

  return style;
});
</script>

<template>
  <div :style="style" :class="schema.interface.class">
    {{ schema.interface.content }}
  </div>
</template>
