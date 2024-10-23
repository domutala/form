<script lang="ts" setup>
import type { Schema } from "~/form/interfaces/Schema";

interface IFile {
  name: string;
  type: string;
  size: number;
  content: string;
}

const props = defineProps({
  modelValue: { type: Object as PropType<IFile | IFile[] | undefined> },
  schema: { type: Object as PropType<Schema>, required: true },
});

const emit = defineEmits<{
  (e: "update:modelValue", v?: IFile | IFile[]): void;
}>();

const files = ref<IFile[]>([]);

onMounted(() => {
  if (Array.isArray(props.modelValue)) files.value = props.modelValue;
  else if (props.modelValue) files.value = [props.modelValue];
});

watch(
  () => files.value,
  () => {
    if (props.schema.interface.validators?.multiple) {
      emit("update:modelValue", files.value);
    } else emit("update:modelValue", files.value[0]);
  },
  { deep: true }
);

function load() {
  if (props.schema.interface.readonly) return;

  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("multiple", props.schema.interface.validators?.multiple);
  input.setAttribute("accept", props.schema.interface.validators?.accept);

  function readFile() {
    const _files = input.files;
    if (!_files?.length) return;

    for (const file of _files) {
      const fileReader = new FileReader();

      fileReader.onload = () => {
        const f = {
          name: file.name,
          type: file.type,
          size: file.size,
          content: fileReader.result as string,
        };
        files.value.push(f);
      };

      fileReader.readAsDataURL(file);
    }
  }

  input.addEventListener("change", readFile);
  input.click();
}
</script>

<template>
  <v-text-field
    :error-messages="schema.errors"
    :label="
      schema.interface.label ??
      Utils.lodash.capitalize(Utils.lodash.startCase(schema.key))
    "
    :model-value="files.map((file) => file.name).join(',')"
    class="ui-schema-file--textfield"
    readonly
    :clearable="!schema.interface.readonly"
    @click="load"
    @click:clear="files = []"
  >
    <template #default>
      <div class="d-flex align-center flex-wrap ga-1">
        <template v-for="(file, f) in files" :key="`${f}-${file.name}`">
          <template v-if="props.schema.interface.validators?.multiple">
            <v-chip v-if="f < 2" closable @click:close="files.splice(f, 1)">
              {{ file.name }}
            </v-chip>
          </template>
          <template v-else>
            {{ file.name }}
          </template>
        </template>
        <div v-if="files.length > 2" style="font-size: 80%; margin-left: 5px">
          +{{ files.length - 2 }}
        </div>

        <div
          v-if="schema.interface.readonly"
          style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.0001);
          "
        ></div>
      </div>
    </template>
  </v-text-field>
</template>

<style lang="scss">
.ui-schema-file--textfield {
  * {
    cursor: pointer;
  }
  input {
    display: none;
  }
}
</style>
