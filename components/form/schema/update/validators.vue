<script lang="ts" setup>
import type { VForm } from "vuetify/components/VForm";
import type { SchemaInterface } from "~/form/interfaces/Schema";

const emit = defineEmits<(e: "update", v: any) => void>();
const props = defineProps({
  schemaInterface: { type: Object as PropType<SchemaInterface> },
});
const data = ref<{ [key: string]: any }>({});
const form = ref<VForm>();

const types = [
  { title: "text", value: "text", props: { icon: "fi fi-sr-align-left" } },
  { title: "email", value: "email", props: { icon: "fi fi-sr-at" } },
  { title: "url", value: "url", props: { icon: "fi fi-sr-link-alt" } },
];

const fileExtensions = ref([
  { value: "text/plain", title: "Text" },
  { value: "text/html", title: "HTML" },
  { value: "text/css", title: "CSS" },
  { value: "application/javascript", title: "JavaScript" },
  { value: "application/json", title: "JSON" },
  { value: "application/xml", title: "XML" },
  { value: "image/jpeg", title: "JPEG" },
  { value: "image/png", title: "PNG" },
  { value: "image/gif", title: "GIF" },
  { value: "application/pdf", title: "PDF" },
  {
    value:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    title: "Word",
  },
  {
    value: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    title: "Excel",
  },
  {
    value:
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    title: "PowerPoint",
  },
  { value: "application/zip", title: "Zip" },
  { value: "application/vnd.rar", title: "Winrar" },
  { value: "audio/mpeg", title: "MP3" },
  { value: "video/mp4", title: "MP4" },
  { value: "video/x-msvideo", title: "AVI" },
  { value: "video/quicktime", title: "AQM" },
  {
    value: "application/vnd.microsoft.portable-executable",
    title: ".exe",
  },
]);
const fileExtensionsSearch = ref("");

onMounted(() => {
  if (props.schemaInterface?.validators) {
    data.value = Utils.lodash.cloneDeep(props.schemaInterface.validators);
  } else data.value = {};

  if (props.schemaInterface?.type === "varchar") {
    data.value.typage ||= "text";
  }
  if (props.schemaInterface?.type === "file") {
    data.value.accepts ||= [];
  }
  if (props.schemaInterface?.type === "select") {
    data.value.options ||= [];
  }
});

watch(() => data.value, save, { deep: true });
async function save() {
  if (!form.value) return;
  if (!(await form.value.validate()).valid) return;

  const type = props.schemaInterface?.type;

  if (!["integer", "decimal"].includes(type)) {
    if (data.value.max) data.value.max = parseInt(data.value.max);
    if (data.value.min) data.value.min = parseInt(data.value.min);
  }

  if (["file"].includes(type)) {
    if (data.value.accept) data.value.accept = data.value.accept;
    else delete data.value.accept;

    if (data.value.maxSize) {
      data.value.maxSize = parseInt(data.value.maxSize);
    } else delete data.value.maxSize;
  }

  if (["varchar", "text", "integer", "decimal"].includes(type)) {
    if (data.value.length) {
      if (data.value.length) {
        data.value.length = parseInt(data.value.length);
      }
      delete data.value.maxLength;
      delete data.value.minLength;
    } else {
      if (data.value.maxLength) {
        data.value.maxLength = parseInt(data.value.maxLength);
      } else delete data.value.maxLength;

      if (data.value.minLength) {
        data.value.minLength = parseInt(data.value.minLength);
      } else delete data.value.minLength;

      delete data.value.length;
    }
  }

  emit("update", data.value);
}
</script>

<template>
  <!-- <v-container class="my-10">
    <div style="width: 552px; max-width: 100%; margin: auto"> -->
  <v-form
    v-if="data"
    ref="form"
    @submit.prevent="save"
    class="formons-builder--validators d-flex flex-column"
  >
    <div v-if="['number'].includes(schemaInterface?.type)" class="d-flex ga-2">
      <v-text-field
        :label="$t('min')"
        type="number"
        v-model="data.min"
        :rules="[
          (v) => {
            if (!v) return true;
            if (!Utils.validator.isInt(v.toString())) return false;
            if (
              data.max &&
              Utils.validator.isInt(data.max.toString()) &&
              parseInt(data.max) < v
            ) {
              return false;
            }

            return true;
          },
        ]"
        clearable
      />
      <v-text-field
        :label="$t('max')"
        type="number"
        v-model="data.max"
        :rules="[
          (v) => {
            if (!v) return true;
            if (!Utils.validator.isInt(v.toString())) return false;
            if (
              data.min &&
              Utils.validator.isInt(data.min.toString()) &&
              parseInt(data.min) > v
            ) {
              return false;
            }

            return true;
          },
        ]"
        clearable
      />
    </div>

    <div
      v-if="['varchar', 'text', 'number'].includes(schemaInterface?.type)"
      class="d-flex ga-2"
    >
      <v-text-field
        v-if="!data.maxLength && !data.minLength"
        :label="$t('length')"
        type="number"
        min="1"
        v-model="data.length"
        :rules="[(v) => (!v ? true : Utils.validator.isInt(v.toString()))]"
        clearable
      />
      <v-text-field
        v-if="!data.length"
        :label="$t('minLength')"
        type="number"
        min="0"
        v-model="data.minLength"
        :rules="[
          (v) => {
            if (!v) return true;
            if (!Utils.validator.isInt(v.toString())) return false;
            if (
              data.maxLength &&
              Utils.validator.isInt(data.maxLength.toString()) &&
              parseFloat(data.maxLength) < v
            ) {
              return false;
            }

            return true;
          },
        ]"
        clearable
      />
      <v-text-field
        v-if="!data.length"
        :label="$t('maxLength')"
        type="number"
        min="1"
        v-model="data.maxLength"
        :rules="[
          (v) => {
            if (!v) return true;
            if (!Utils.validator.isInt(v.toString())) return false;
            if (
              data.minLength &&
              Utils.validator.isInt(data.minLength.toString()) &&
              parseFloat(data.minLength) > v
            ) {
              return false;
            }

            return true;
          },
        ]"
        clearable
      />
    </div>

    <div v-if="schemaInterface?.type === 'number'">
      <v-switch
        inset
        color="primary"
        :label="$t('model.schema.title.isFloat')"
        v-model="data.isFloat"
      ></v-switch>
    </div>

    <div v-if="['file'].includes(schemaInterface?.type)">
      <v-autocomplete
        clearable
        chips
        closable-chips
        multiple
        hide-details
        class="mb-1"
        :label="$t('model.schema.title.fileAccept')"
        variant="outlined"
        :items="fileExtensions"
        v-model="data.accepts"
        v-model:search="fileExtensionsSearch"
      >
        <template #no-data>
          <div class="pa-3">
            <v-btn
              rounded
              color="dark"
              @click="
                fileExtensions.push({
                  value: fileExtensionsSearch,
                  title: fileExtensionsSearch,
                });
                data.accepts.push(fileExtensionsSearch);
                fileExtensionsSearch = '';
              "
            >
              <template #prepend>
                <i class="fi fi-br-plus"></i>
              </template>
              add
            </v-btn>
          </div>
        </template>
      </v-autocomplete>

      <v-text-field
        v-if="['file'].includes(schemaInterface?.type)"
        :label="$t('model.schema.title.fileMaxsize')"
        type="number"
        min="1"
        v-model="data.maxSize"
        :rules="[
          (v) => {
            if (!v) return true;
            if (!Utils.validator.isInt(v.toString())) return false;
            return true;
          },
        ]"
        clearable
      >
        <template #append-inner>Mbits</template>
      </v-text-field>
    </div>

    <div v-if="schemaInterface?.type === 'varchar'">
      <v-select :label="$t('type')" :items="types" v-model="data.typage">
        <template #selection="{ item }">
          <i :class="item.props.icon" class="mr-3"></i>
          {{ item.title }}
        </template>

        <template v-slot:item="{ props, item }">
          <v-list-item v-bind="props">
            <template #prepend>
              <i :class="item.props.icon" class="mr-3"></i>
            </template>
          </v-list-item>
        </template>
      </v-select>
    </div>

    <div
      v-if="schemaInterface?.type === 'select' && data.options"
      class="d-flex flex-column ga-2"
    >
      <div
        v-for="(option, o) in data.options"
        :key="o"
        class="d-flex align-center ga-2"
      >
        <v-text-field
          readonly
          required
          for="value"
          :placeholder="$t('value')"
          class="w-100"
          :value="option.value"
        >
        </v-text-field>
        <v-text-field
          readonly
          required
          for="title"
          :placeholder="$t('label')"
          :value="option.title"
          class="w-100"
        >
          <template #append-inner>
            <v-btn
              size="22"
              color="dark"
              icon
              @click="data.options.splice(o, 1)"
            >
              <i class="fi fi-rr-cross-small"></i>
            </v-btn>
          </template>
        </v-text-field>
      </div>

      <v-form
        :key="data.options.length"
        @submit.prevent="
            (e) => {
              if (!e.target) return;
              const inputs = (e.target as HTMLFormElement).querySelectorAll('input');
              const option = {title: '', value: ''};

              inputs.forEach((input)=> {
                option[input.getAttribute('for') as 'title'] = input.value;
              })

             if (option.title && option.value) data.options.push(option)
            }
          "
        class="d-flex align-center ga-2"
      >
        <v-text-field
          required
          for="value"
          :placeholder="$t('value')"
          class="w-100"
        >
        </v-text-field>
        <v-text-field
          required
          for="title"
          :placeholder="$t('label')"
          class="w-100"
        >
          <template #append-inner>
            <v-btn size="small" type="submit" rounded> add </v-btn>
          </template>
        </v-text-field>
      </v-form>
    </div>

    <div v-if="['file', 'select'].includes(schemaInterface?.type)">
      <v-switch
        inset
        color="primary"
        label="multiple"
        v-model="data.multiple"
      ></v-switch>
    </div>

    <div
      v-if="
        !['one-to-one', 'one-to-many', 'many-to-many'].includes(
          schemaInterface?.type
        )
      "
    >
      <v-switch
        inset
        color="primary"
        :label="$t('model.schema.title.fieldRequired')"
        v-model="data.required"
      ></v-switch>
    </div>
  </v-form>
  <!-- </div>
  </v-container> -->
</template>

<style lang="scss">
.formons-builder--validators {
  gap: 15px;

  > * {
    padding-bottom: 16px;

    &:not(:last-child) {
      border-bottom: 1px solid rgba(var(--v-theme-on-background), 0.07);
    }
  }
}
</style>
