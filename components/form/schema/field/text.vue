<script lang="ts" setup>
import type { Model } from "~/form/interfaces/Model";
import type { Schema } from "~/form/interfaces/Schema";

const props = defineProps({
  modelValue: { type: String as PropType<string | undefined> },
  model: { type: Object as PropType<Model>, required: true },
  schemaKey: { type: String, required: true },
  schema: { type: Object as PropType<Schema>, required: true },
});

const emit = defineEmits<{ (e: "update:modelValue", v?: string): void }>();

const value = ref<string>();

const _schema = computed(() => {
  return props.model.schemas; //[props.model.schemasIndex[props.schemaKey]];
});

onMounted(() => {
  value.value = props.modelValue;
});
watch(
  () => props.modelValue,
  () => {
    value.value = props.modelValue;
  }
);

watch(
  () => value.value,
  () => emit("update:modelValue", value.value)
);
</script>

<template>
  <v-textarea
    v-model="value"
    :type="schema.interface.validators?.typage"
    :error-messages="schema.errors"
    :label="
      schema.interface.label ??
      Utils.lodash.capitalize(Utils.lodash.startCase(schema.key))
    "
    :length="schema.interface.validators?.length"
    :min-length="schema.interface.validators?.minLength"
    :max-length="schema.interface.validators?.maxLength"
    :required="schema.interface.validators?.required"
    :readonly="schema.interface.readonly"
    clearable
  >
  </v-textarea>
</template>
