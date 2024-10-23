<script lang="ts" setup>
import type { Schema } from "~/form/interfaces/Schema";

const props = defineProps({
  modelValue: { type: String as PropType<string | undefined> },
  schema: { type: Object as PropType<Schema>, required: true },
});

const emit = defineEmits<{ (e: "update:modelValue", v?: string): void }>();

const value = ref<string>();

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
  <v-text-field
    v-model="value"
    :type="schema.interface.validators?.typage"
    :error-messages="schema.errors"
    :label="
      schema.interface.label ??
      Utils.lodash.capitalize(Utils.lodash.startCase(schema.key))
    "
    :required="schema.interface.validators?.required"
    :readonly="schema.interface.readonly"
    :rules="[
      (v) => {
        if (v && !Utils.validator.isUUID(v.toString())) return 'must_be_uuid';
        return true;
      },
    ]"
    clearable
  >
  </v-text-field>
</template>
