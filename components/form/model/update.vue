<script lang="ts" setup>
import Sortable from "sortablejs";
import type { Options } from "~/form";
import type { SchemaOptions } from "~/form/interfaces/Schema";

const emit = defineEmits<(e: "update", v: Options) => void>();

const sortable = ref<Sortable>();
const formons = ref<HTMLDivElement>();
const _model = ref<Options>({ schemaOptions: [] } as any);

onMounted(() => {
  setModel();
  setSortable();
});

async function setSortable() {
  if (!formons.value) return;
  sortable.value?.destroy();

  sortable.value = Sortable.create(formons.value, {
    scroll: true,
    animation: 150,
    dragClass: "sorting",
    handle: ".sortable-handle",
    forceFallback: true,
    onEnd: function (evt) {
      if (
        typeof evt.oldIndex === "number" &&
        typeof evt.newIndex === "number" &&
        evt.oldIndex !== evt.newIndex
      ) {
        const newOrder: SchemaOptions[] = [];
        formons
          .value!.querySelectorAll(".formons-schema--editer")
          .forEach((row) => {
            const key = row.getAttribute("formons-key")!;
            const item = _model.value.schemaOptions!.find(
              (schema) => schema.key === key
            );
            newOrder.push(item!);
          });

        _model.value.schemaOptions = newOrder;
      }
    },
  });
}

watch(
  () => Store.organization.current?.models[Store.organization._currentModel],
  setModel,
  { deep: true }
);
function setModel() {
  const index = Store.organization._currentModel;
  const model = Store.organization.current?.models[index];
  if (!model) return;

  _model.value = Utils.lodash.cloneDeep(model);
  _model.value.schemaOptions ||= [];
}
</script>

<template>
  <div class="formons">
    <div ref="formons" class="formons-schemas--container">
      <template
        v-for="(schemaOption, s) in _model.schemaOptions"
        :key="schemaOption.key"
      >
        <form-schema-update :index="s" :model="_model">
          <template #activator="{ props }">
            <div
              class="formons-schema--content formons-schema--editer d-flex align-center pa-1 rounded-lg"
              :formons-key="schemaOption.key"
            >
              <div
                class="sortable-handle pa-1 h-100 d-flex align-center"
                style="cursor: grab"
              >
                <i class="fi fi-ss-grip-dots-vertical"></i>
              </div>
              <div
                v-bind="props"
                class="formons-schema--editer__content pa-4 d-flex align-center ga-2"
              >
                <div>
                  {{
                    Utils.lodash.capitalize(
                      Utils.lodash.startCase(schemaOption.key)
                    )
                  }}
                </div>

                <v-spacer />

                <i
                  v-if="schemaOption.interface?.lock"
                  class="fi fi-sr-lock"
                  style="font-size: 18px"
                ></i>

                <v-chip size="x-small" rounded="lg">
                  {{ $t(`model.schema.types.${schemaOption.interface?.type}`) }}
                </v-chip>
              </div>
            </div>
          </template>
        </form-schema-update>
      </template>
    </div>

    <form-schema-create>
      <template #activator="{ props }">
        <div
          class="formons-schema--content formons-schema--editer d-flex align-center pa-1 rounded-lg"
        >
          <div class="sortable-handle pa-1 h-100 d-flex align-center"></div>
          <div
            v-bind="props"
            class="formons-schema--editer__content pa-4 d-flex align-center ga-2"
          >
            <i class="fi fi-br-plus"></i>
            <div>{{ $t("model.schema.title.add") }}</div>
          </div>
        </div>
      </template>
    </form-schema-create>
  </div>
</template>

<style lang="scss">
.formons {
  .formons-schema--editer {
    // user-select: none;

    .sortable-handle {
      width: 25px;
    }

    &.sorting {
      opacity: 1 !important;
      background-color: rgba(var(--v-theme-background));
      box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px,
        rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px,
        rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px,
        rgba(0, 0, 0, 0.07) 0px 32px 64px;
    }

    .formons-schema--editer__content {
      width: 100%;
      cursor: pointer;
      border: 1px solid rgba(var(--v-theme-on-background), 0.1);

      &:hover {
        border-color: rgba(var(--v-theme-on-background), 1);
      }
    }
  }
}
</style>
