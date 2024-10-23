<script lang="ts" setup>
import type { VForm } from "vuetify/components/VForm";
import type { Options } from "~/form";
import type { SchemaOptions } from "~/form/interfaces/Schema";

const emit = defineEmits<(e: "update", v: Options) => void>();
const i18n = useI18n();
const isDialogOpen = ref(false);
const submitting = ref(false);
const types = [
  { value: "text", title: i18n.t("model.schema.types.varchar") },
  { value: "longtext", title: i18n.t("model.schema.types.text") },
  { value: "number", title: i18n.t("model.schema.types.number") },
  { value: "boolean", title: i18n.t("model.schema.types.boolean") },
  { value: "date", title: i18n.t("model.schema.types.date") },
  { value: "paragraph", title: i18n.t("model.schema.types.paragraph") },
  { value: "select", title: i18n.t("model.schema.types.select") },
  { value: "file", title: i18n.t("model.schema.types.file") },
  // { value: "uuid", title: i18n.t("model.schema.types.uuid") },
  // { title: "json", value: "json" },
  // { title: "one-to-one", value: "one-to-one" },
  // { title: "one-to-many", value: "one-to-many" },
  // { title: "many-to-many", value: "many-to-many" },
];
const data = ref<SchemaOptions>({ interface: { type: "varchar" } } as any);
const form = ref<VForm>();

const model = computed(() => {
  const index = Store.organization._currentModel;
  const model = { ...Store.organization.current.models[index] };

  return model;
});

watch(
  () => isDialogOpen.value,
  () => {
    data.value = { interface: { type: "varchar" } } as any;
  }
);

async function save() {
  if (!Store.organization.current) return;

  if (!form.value) return;
  form.value.validate();
  if (!form.value.isValid) return;

  if (
    !["one-to-one", "one-to-many", "many-to-many"].includes(
      data.value.interface?.type
    )
  ) {
    delete data.value.interface?.to;
  } else data.value.interface!.to = `model_${data.value.interface!.to}`;

  const schemaOptions = model.value.schemaOptions || [];

  try {
    schemaOptions.push({
      ...data.value,
      key: Utils.lodash.camelCase(data.value.key),
    });

    await Store.organization.createModel({
      schemaOptions,
      id: model.value.id,
      organizationId: Store.organization.current.id,
    });

    isDialogOpen.value = false;
  } catch (error) {}
}
</script>

<template>
  <v-dialog v-model="isDialogOpen" maxWidth="540" :persistent="submitting">
    <template #activator="{ props, isActive, targetRef }">
      <slot
        name="activator"
        :props="props"
        :isActive="isActive"
        :targetRef="targetRef"
      />
    </template>

    <v-card>
      <v-container>
        <div class="pa-5">
          <v-form
            ref="form"
            @submit.prevent="save"
            class="d-flex flex-column ga-2"
          >
            <v-text-field
              autofocus
              :label="$t('key')"
              v-model="data.key"
              :hint="
                Utils.lodash.camelCase(data.key) !== data.key
                  ? Utils.lodash.camelCase(data.key)
                  : undefined
              "
              persistent-hint
              :rules="[
                (v) => {
                  if (!v) return false;
                  if (
                    (model.schemaOptions || [])
                      .map((v) => v.key.toLowerCase())
                      .includes(v.toLowerCase())
                  )
                    return false;
                  if (v.toLowerCase() === 'id') return false;
                  return Utils.validator.matches(v, /^[a-zA-Z0-9_\s]+$/g);
                },
              ]"
            >
            </v-text-field>

            <v-select
              :label="$t('type')"
              :items="types"
              v-model="data.interface!.type"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props">
                  <!-- <template #append>
                    <svg-icon
                      :name="`schema/${item.value}`"
                      width="22"
                      height="22"
                    />
                  </template> -->
                </v-list-item>
              </template>
            </v-select>

            <!-- <v-select
            v-if="['one-to-one', 'one-to-many', 'many-to-many'].includes(data.interface!.type)"
            label="to"
            :items="
              models.map((mo) => ({
                value: mo.name,
                title: Utils.lodash.capitalize(Utils.lodash.startCase(mo.name)),
              }))
            "
            v-model="data.interface!.to"
            :rules="[
              (v) => {
                if (!v) return false;
                return true;
              },
            ]"
          >
          </v-select> -->

            <div class="d-flex align-center ga-2">
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
                  {{ $t("save") }}
                </v-btn>
              </div>
            </div>
          </v-form>
        </div>
      </v-container>
    </v-card>
  </v-dialog>
</template>
