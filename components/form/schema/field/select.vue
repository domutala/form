<script lang="ts" setup>
import type { Schema } from "~/form/interfaces/Schema";

const props = defineProps({
  modelValue: { type: Object as PropType<any> },
  schema: { type: Object as PropType<Schema>, required: true },
});

const emit = defineEmits<{ (e: "update:modelValue", v?: any): void }>();

const value = ref<any>();

onMounted(() => (value.value = props.modelValue));
watch(
  () => props.modelValue,
  () => (value.value = props.modelValue)
);

watch(
  () => value.value,
  () => emit("update:modelValue", value.value)
);
</script>

<template>
  <v-select
    v-model="value"
    :error-messages="schema.errors"
    :label="
      schema.interface.label ??
      Utils.lodash.capitalize(Utils.lodash.startCase(schema.key))
    "
    :items="schema.interface.validators?.options"
    :multiple="schema.interface.validators?.multiple"
    :readonly="schema.interface.readonly"
    clearable
  >
  </v-select>
</template>
