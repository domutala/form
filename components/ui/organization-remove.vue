<script lang="ts" setup>
import type { IOrganization } from "~/models/Organization";

const props = defineProps({
  organization: { type: Object as PropType<IOrganization>, required: true },
});

const isDialogOpen = ref(false);
const submitting = ref(false);
const data = ref({ name: "" });

async function submit() {
  if (submitting.value) return;

  try {
    submitting.value = true;
    await Store.organization.remove({ id: props.organization?.id });
    isDialogOpen.value = false;
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <v-dialog v-model="isDialogOpen" max-width="400" :persistent="submitting">
    <template #activator="{ isActive, props }">
      <slot name="activator" :isActive="isActive" , :props="props" />
    </template>
    <v-card>
      <v-container>
        <v-form ref="form" @submit.prevent="submit">
          {{ $t("organization.remove.warning") }}

          <div class="d-flex align-center ga-2 mt-5">
            <div style="width: 100%">
              <v-btn
                type="button"
                color="surface"
                rounded="lg"
                :disabled="submitting"
                block
                @click="isDialogOpen = false"
              >
                {{ $t("cancel") }}
              </v-btn>
            </div>
            <div style="width: 100%">
              <v-btn
                type="submit"
                color="red"
                rounded="lg"
                :loading="submitting"
                block
              >
                {{ $t("save") }}
              </v-btn>
            </div>
          </div>
        </v-form>
      </v-container>
    </v-card>
  </v-dialog>
</template>
