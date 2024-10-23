<script lang="ts" setup>
import type { VDatePicker } from "vuetify/components";
import type { Schema } from "~/form/interfaces/Schema";

const props = defineProps({
  modelValue: { type: Object as PropType<string | Date | undefined> },
  schema: { type: Object as PropType<Schema>, required: true },
});

const emit = defineEmits<{
  (e: "update:modelValue", v?: string | Date): void;
}>();

const value = ref<Date | string>();
const date = ref<Date>();
const datepicker = ref<VDatePicker>();
const isModalOpen = ref(false);

onMounted(onModelValue);
watch(() => props.modelValue, onModelValue);
function onModelValue() {
  if (props.modelValue) value.value = props.modelValue;
  else value.value = undefined;
}

const formated = computed(() => {
  if (!value.value) return "";

  return useDayjs()(value.value).format("DD/MM/YYYY");
});

watch(
  () => value.value,
  () => emit("update:modelValue", value.value)
);

watch(
  () => isModalOpen.value,
  () => {
    if (isModalOpen.value) {
      if (value.value) date.value = new Date(value.value);
    }
  }
);

function select() {
  if (date.value) value.value = new Date(date.value);
  isModalOpen.value = false;
}
</script>

<template>
  <v-menu
    v-model="isModalOpen"
    :close-on-content-click="false"
    :disabled="schema.interface.readonly"
  >
    <template #activator="{ props }">
      <v-text-field
        v-bind="props"
        :type="schema.interface.validators?.typage"
        :error-messages="schema.errors"
        :label="
          schema.interface.label ??
          Utils.lodash.capitalize(Utils.lodash.startCase(schema.key))
        "
        :required="schema.interface.validators?.required"
        :model-value="formated"
        :clearable="!schema.interface.readonly"
        readonly
        @click:clear="value = undefined"
      >
      </v-text-field>
    </template>

    <v-date-picker v-model="date" hide-header ref="datepicker">
      <template #actions>
        <v-btn @click="select">ok</v-btn>
      </template>
    </v-date-picker>
    <!-- <v-time-picker></v-time-picker> -->
  </v-menu>
</template>
