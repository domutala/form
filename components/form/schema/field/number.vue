<script lang="ts" setup>
import type { Schema } from "~/form/interfaces/Schema";

const props = defineProps({
  modelValue: { type: Number as PropType<number | undefined> },
  schema: { type: Object as PropType<Schema>, required: true },
});

const emit = defineEmits<{ (e: "update:modelValue", v?: number): void }>();

const value = ref<number>();

onMounted(() => (value.value = props.modelValue));
watch(
  () => props.modelValue,
  () => (value.value = props.modelValue)
);

watch(
  () => value.value,
  () => {
    if (
      value.value === null ||
      typeof value.value === "undefined" ||
      // @ts-ignore
      value.value === ""
    ) {
      return emit("update:modelValue");
    } else if (Utils.validator.isNumeric(value.value.toString())) {
      emit("update:modelValue", value.value);
    } else emit("update:modelValue", value.value);
  }
);
</script>

<template>
  <v-text-field
    v-model="value"
    type="number"
    :error-messages="schema.errors"
    :label="
      schema.interface.label ??
      Utils.lodash.capitalize(Utils.lodash.startCase(schema.key))
    "
    :length="schema.interface.validators?.length"
    :min-length="schema.interface.validators?.minLength"
    :max-length="schema.interface.validators?.maxLength"
    :min="schema.interface.validators?.min"
    :max="schema.interface.validators?.max"
    :required="schema.interface.validators?.required"
    :readonly="schema.interface.readonly"
    clearable
  >
  </v-text-field>
</template>
