<script lang="ts" setup>
import type { Options } from "~/form";
import type { SchemaOptions } from "~/form/interfaces/Schema";

const props = defineProps({
  model: { type: Object as PropType<Options>, required: true },
  index: { type: Number, required: true },
});

const isDialogOpen = ref(false);
const isAskRemoveOpen = ref(false);
const _schemaOptions = ref<SchemaOptions>({ key: "" });
const submitting = ref(false);

const isEqual = computed(() => {
  const schema = (props.model.schemaOptions || [])[props.index];
  return Utils.lodash.isEqualWith(_schemaOptions.value, schema);
});

const schemaOptions = computed(() => {
  const schema = (props.model.schemaOptions || [])[props.index];

  return schema;
});

watch(() => isDialogOpen.value, setSchemaOption);
watch(() => schemaOptions.value, setSchemaOption, { deep: true });
onMounted(setSchemaOption);
function setSchemaOption() {
  if (!isDialogOpen.value) return;

  isAskRemoveOpen.value = false;
  _schemaOptions.value = Utils.lodash.cloneDeep(schemaOptions.value);
}

async function submit() {
  if (submitting.value) return;

  submitting.value = true;
  try {
    const schemaOptions = [...(props.model.schemaOptions || [])];
    schemaOptions[props.index] = _schemaOptions.value;

    const e = await Store.organization.createModel({
      schemaOptions,
      id: props.model.id,
      organizationId: Store.organization.current?.id,
    });

    isDialogOpen.value = false;
  } finally {
    submitting.value = false;
  }
}

async function remove() {
  if (submitting.value) return;

  submitting.value = true;
  try {
    const schemaOptions = [...(props.model.schemaOptions || [])];
    schemaOptions.splice(props.index, 1);

    const model = await Store.organization.createModel({
      schemaOptions,
      id: props.model.id,
    });
  } finally {
    submitting.value = false;
  }
}

onBeforeRouteLeave(() => {
  if (isEqual.value) return true;

  const answer = window.confirm(
    "Do you really want to leave? you have unsaved changes!"
  );
  if (!answer) return false;
});
</script>

<template>
  <v-dialog
    :persistent="submitting || !isEqual"
    v-model="isDialogOpen"
    class="form-schema-update-dialog"
    transition="slide-x-transition"
    fullscreen
  >
    <template #activator="{ props, isActive, targetRef }">
      <slot
        name="activator"
        :props="props"
        :isActive="isActive"
        :targetRef="targetRef"
      />
    </template>

    <v-card height="100%" rounded="0" color="background">
      <v-card-title
        class="d-flex align-center bg-background mb-4 border-b"
        style="position: sticky; top: 0; z-index: 10"
      >
        <div class="text-medium-emphasis ps-2">
          {{
            Utils.lodash.capitalize(Utils.lodash.startCase(_schemaOptions.key))
          }}
        </div>

        <v-spacer />

        <v-chip size="x-small" rounded="lg">
          {{ $t(`model.schema.types.${_schemaOptions?.interface?.type}`) }}
        </v-chip>
      </v-card-title>

      <div style="width: 552px; max-width: 90%; margin: auto">
        <v-chip text="interface" size="small" class="mb-5" ounded></v-chip>
        <form-schema-update-interface
          :schema-interface="_schemaOptions.interface"
          @update="(v) => (_schemaOptions.interface = v)"
        />

        <v-chip text="validator" size="small" class="mb-5" rounded></v-chip>
        <form-schema-update-validators
          :schema-interface="_schemaOptions.interface"
          @update="v => {
            _schemaOptions.interface ||= {};
            _schemaOptions.interface!.validators = v;
          }"
        />
      </div>

      <v-card-actions
        class="d-flex bg-background mt-4 border-t"
        style="position: sticky; bottom: 0; z-index: 10"
      >
        <template v-if="!_schemaOptions.interface?.lock">
          <v-menu
            open-on-click
            :open-on-hover="false"
            location="top center"
            offset="5"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                size="x-small"
                color="red"
                variant="text"
                icon
              >
                <i class="fi fi-sr-trash-xmark" style="font-size: 18px"></i>
              </v-btn>
            </template>

            <template #default="{ isActive }">
              <v-card color="red" rounded="pill">
                <div class="pa-3">
                  <v-btn
                    color="dark"
                    class="mr-1"
                    rounded="pill"
                    @click="isActive.value = false"
                  >
                    cancel
                  </v-btn>

                  <v-btn color="dark" rounded="pill" @click="remove()">
                    <template #prepend>
                      <i
                        class="fi fi-sr-trash-xmark"
                        style="font-size: 18px"
                      ></i>
                    </template>
                    <span>yesRemove</span>
                  </v-btn>
                </div>
              </v-card>
            </template>
          </v-menu>
        </template>

        <v-spacer></v-spacer>

        <v-btn
          :disabled="submitting"
          color="dark"
          variant="tonal"
          text="cancel"
          @click="isDialogOpen = false"
        ></v-btn>

        <v-btn
          :disabled="isEqual"
          :loading="submitting"
          color="primary"
          text="Save"
          variant="flat"
          @click="submit"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss">
.form-schema-update-dialog {
  .v-overlay__content {
    right: 0;
    left: unset;

    width: 100%;
    max-width: 662px;

    @media (max-width: 772px) {
      max-width: unset;
    }
  }
}
</style>
