<script lang="ts" setup>
import type { Schema } from "~/form/interfaces/Schema";

const props = defineProps({
  modelValue: { type: Boolean as PropType<boolean | undefined> },
  schema: { type: Object as PropType<Schema>, required: true },
});

const emit = defineEmits<{ (e: "update:modelValue", v?: boolean): void }>();

const value = ref<boolean>();

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
  <v-switch
    inset
    v-model="value"
    color="primary"
    v-bind="schema.interface.props"
    :error-messages="schema.errors"
    :label="
      schema.interface.label ??
      Utils.lodash.capitalize(Utils.lodash.startCase(schema.key))
    "
    :required="schema.interface.validators?.required"
    :readonly="schema.interface.readonly"
    clearable
  ></v-switch>
</template>
