<script lang="ts" setup>
const isDialogOpen = ref(false);
const isSubmitting = ref(false);

async function submit() {
  if (isSubmitting.value) return;

  try {
    isSubmitting.value = true;

    await Store.organization.removeModel({
      id: Store.organization.current.models[Store.organization._currentModel]
        .id,
    });

    isDialogOpen.value = false;
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <v-alert
    :icon="false"
    :title="$t('model.remove.title')"
    type="error"
    color="red"
    variant="outlined"
    rounded="lg"
  >
    <template #default>
      {{ $t("model.remove.warning") }}

      <div class="mt-3">
        <v-btn color="red" rounded @click="isDialogOpen = true">
          {{ $t("remove") }}
        </v-btn>
      </div>
    </template>
  </v-alert>

  <v-dialog v-model="isDialogOpen" max-width="400" :persistent="isSubmitting">
    <v-card>
      <v-container>
        {{ $t("model.remove.warning") }}

        <div class="mt-3">
          <v-btn
            :disabled="isSubmitting"
            color="dark"
            rounded
            @click="isDialogOpen = false"
          >
            {{ $t("cancel") }}
          </v-btn>
          <v-btn
            color="red"
            class="ml-2"
            :loading="isSubmitting"
            rounded
            @click="submit"
          >
            {{ $t("remove") }}
          </v-btn>
        </div>
      </v-container>
    </v-card>
  </v-dialog>
</template>
