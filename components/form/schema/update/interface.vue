<script lang="ts" setup>
import type { VForm } from "vuetify/components/VForm";
import type { SchemaInterface } from "~/form/interfaces/Schema";

const emit = defineEmits<(e: "update", v: any) => void>();
const props = defineProps({
  schemaInterface: { type: Object as PropType<SchemaInterface> },
});

const data = ref<{ [key: string]: any }>({});
const form = ref<VForm>();

onMounted(() => {
  data.value = Utils.lodash.cloneDeep(props.schemaInterface || {});
});

watch(() => data.value, save, { deep: true });
async function save() {
  if (!form.value) return;
  if (!(await form.value.validate()).valid) return;

  emit("update", data.value);
}
</script>

<template>
  <v-form ref="form" @submit.prevent="save" class="d-flex flex-column ga-2">
    <v-text-field
      v-if="data.schemaInterface?.type !== 'paragraph'"
      v-model="data.label"
      :label="$t('label')"
      clearable
    ></v-text-field>

    <v-textarea
      v-else
      v-model="data.content"
      :label="$t('content')"
      clearable
    ></v-textarea>

    <v-text-field
      v-if="data.schemaInterface?.type === 'paragraph'"
      v-model="data.fontSize"
      :label="$t('fontSize')"
      type="number"
      min="1"
      max="64"
    >
    </v-text-field>
  </v-form>
</template>
