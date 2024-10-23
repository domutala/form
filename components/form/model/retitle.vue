<script lang="ts" setup>
import type { VForm } from "vuetify/components";

const isSubmitting = ref(false);
const title = ref("");
const form = ref<VForm>();

async function submit() {
  if (isSubmitting.value) return;
  if (!form.value) return;

  await form.value.validate();
  if (!form.value.isValid) return;

  try {
    isSubmitting.value = true;

    await Store.organization.createModel({
      id: Store.organization.current.models[Store.organization._currentModel]
        .id,
      title: title.value,
    });
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(() => {
  title.value =
    Store.organization.current.models[Store.organization._currentModel].title;
});
</script>

<template>
  <v-form class="mb-9" ref="form" @submit.prevent="submit">
    <v-text-field
      :label="$t('name')"
      v-model="title"
      :rules="[
        (v) => {
          if (!v) return 'required';
          return true;
        },
      ]"
    >
    </v-text-field>

    <v-btn
      :disabled="
        title ===
        Store.organization.current.models[Store.organization._currentModel]
          .title
      "
      color="dark"
      rounded
      type="submit"
      :loading="isSubmitting"
    >
      {{ $t("rename") }}
    </v-btn>
  </v-form>
</template>
