<script lang="ts" setup>
import type { VForm } from "vuetify/components";
import type { IOrganization } from "~/models/Organization";

const props = defineProps({
  organization: { type: Object as PropType<IOrganization>, required: true },
});
const i18n = useI18n();

const isDialogOpen = ref(false);
const submitting = ref(false);
const email = ref("");
const form = ref<VForm>();

async function submit() {
  if (submitting.value) return;

  await form.value?.validate();
  if (!form.value?.isValid) return;

  try {
    submitting.value = true;
    await Store.organization.addMember({
      email: email.value,
      organization: props.organization?.id,
    });
    isDialogOpen.value = false;
    email.value = "";

    Utils.Toast.push({
      text: i18n.t("organization.title.memberSuccesAdded"),
      color: "success",
    });
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
          <v-text-field
            v-model="email"
            :rules="[
              (v) => {
                if (!v) return $t('fieldRequired');
                return true;
              },
            ]"
            type="email"
            :label="$t('email')"
          ></v-text-field>

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
              <v-btn type="submit" rounded="lg" :loading="submitting" block>
                {{ $t("send") }}
              </v-btn>
            </div>
          </div>
        </v-form>
      </v-container>
    </v-card>
  </v-dialog>
</template>
