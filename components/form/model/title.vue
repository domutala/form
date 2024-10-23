<script lang="ts" setup>
import type { VForm } from "vuetify/components";
import type { Options } from "~/form";

const emit = defineEmits<(e: "save", v: Options) => void>();
const props = defineProps({
  options: { type: Object as PropType<Options> },
});
const isOpen = ref(false);
const submitting = ref(false);
const title = ref("");
const form = ref<VForm>();

watch(() => isOpen.value, mounted);
function mounted() {
  if (!isOpen.value) return;

  if (props.options) {
    title.value = props.options.title;
  } else title.value = "";
}

async function submit() {
  if (submitting.value) return;

  if (!form.value) return;
  form.value.validate();

  if (!form.value.isValid) return;
  if (props.options && title.value === props.options.title) return;

  submitting.value = true;

  try {
    await Store.organization.createModel({
      title: title.value,
      id: props.options?.id,
      organizationId: props.options?.id || Store.organization.current.id,
    });

    Store.organization.setCurrentModel(
      Store.organization.current.models.length - 1
    );

    isOpen.value = false;
  } finally {
    submitting.value = false;
  }
}

defineExpose({ isOpen });
</script>

<template>
  <v-dialog maxWidth="540" v-model="isOpen" :persistent="submitting">
    <template #activator="{ props, isActive, targetRef }">
      <slot
        name="activator"
        :props="props"
        :isActive="isActive"
        :targetRef="targetRef"
      />
    </template>

    <v-card height="100%" rounded="0">
      <div class="pa-5">
        <v-form
          ref="form"
          @submit.prevent="submit"
          class="d-flex flex-column ga-2"
        >
          <v-text-field
            v-model="title"
            :label="$t('name')"
            :rules="[
              (v) => {
                if (!v) return false;
                return true;
              },
            ]"
            clearable
          >
          </v-text-field>
          <div class="d-flex align-center ga-2">
            <div style="width: 100%">
              <v-btn
                type="button"
                color="surface"
                rounded="lg"
                :disabled="submitting"
                block
                @click="isOpen = false"
              >
                {{ $t("cancel") }}
              </v-btn>
            </div>
            <div style="width: 100%">
              <v-btn
                type="submit"
                rounded="lg"
                :loading="submitting"
                :disabled="options && title === options.title"
                block
              >
                {{ $t("save") }}
              </v-btn>
            </div>
          </div>
        </v-form>
      </div>
    </v-card>
  </v-dialog>
</template>
