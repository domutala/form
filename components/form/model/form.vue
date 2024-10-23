<script lang="ts" setup>
import type { VForm } from "vuetify/components";
import { create, type Options } from "~/form";
import type { Model } from "~/form/interfaces/Model";

const emit = defineEmits<(e: "save", v?: { [key: string]: any }) => void>();

const props = defineProps({
  model: { type: Object as PropType<Options>, required: true },
  testMode: { type: Boolean, default: false },
  base: { type: Object as PropType<{ [key: string]: any }> },
});

const formons = ref<VForm>();
const model_ = ref<Model>();
const availableType = [
  "number",
  "varchar",
  "uuid",
  "text",
  "boolean",
  "file",
  "select",
  "date",
  "paragraph",
];
const submitting = ref(false);
const success = ref(false);

onMounted(async () => {
  model_.value = await create({
    ...props.model,
    base: props.base,
    async onSubmit(model) {
      model_.value = model;
      save();
    },
  });
  setTimeout(async () => {
    model_.value = await model_.value!.mount(formons.value?.$el);
  }, 10);
});

async function save() {
  if (!model_.value) return;

  if (submitting.value) return;
  if (!model_.value.isFormValid) return;

  if (props.testMode) {
    success.value = true;
    return;
  }

  submitting.value = true;
  try {
    // const { data } = await Supabase.client
    //   .from("input")
    //   .insert({ value: model_.value.formValues })
    //   .select();

    success.value = true;
  } finally {
    submitting.value = false;
  }
}

watch(
  () => model_.value?.formValues,
  () => {
    if (!Utils.lodash.isEqual(model_.value?.formValues, props.base)) {
      // model_.value?.validate();
      // emit("save", model_.value?.formValues);
    }
  },
  { deep: true }
);

function submit() {
  model_.value?.submit();
}
</script>

<template>
  <div v-if="model_" class="formons">
    <div v-if="success">
      <div
        class="bg-success"
        style="
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 100%;
          font-size: 54px;
          margin: auto;
        "
      >
        <i class="fi fi-br-check"></i>
      </div>
    </div>
    <v-form
      v-else
      @submit.prevent
      ref="formons"
      class="formons-schemas--container"
    >
      <template v-for="schema in model_.schemas" :key="schema.key">
        <template v-if="!schema.interface.hide">
          <div class="formons-schema--editer" :formons-key="schema.key">
            <div v-bind="props" class="formons-schema--content">
              <component
                v-if="availableType.includes(schema.interface.type)"
                :model="model_"
                :schema-key="schema.key"
                :schema="schema"
                :is="`form-schema-field-${schema.interface.type}`"
                v-model="model_.formValues[schema.key]"
                @update:modelValue="() => model_?.validate(schema.key)"
              />
              <!-- <div v-else>
                {{ schema.key }}
              </div> -->
            </div>
          </div>
        </template>
      </template>

      <div class="mt-2">
        <v-btn
          size="x-large"
          color="dark"
          rounded="0"
          type="submit"
          :loading="submitting"
          block
        >
          save
        </v-btn>
      </div>
    </v-form>
  </div>
</template>
