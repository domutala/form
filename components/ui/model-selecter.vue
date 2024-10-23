<script lang="ts" setup>
import FormModelTitle from "~/components/form/model/title.vue";

const createForm = ref<any>();

function openCreateForm() {
  if (!createForm.value) return;
  createForm.value.isOpen = true;
}
</script>

<template>
  <v-menu
    v-if="Store.organization.current"
    offset="5"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ props }">
      <v-btn color="dark" variant="text" border rounded="pill" v-bind="props">
        <span
          v-if="
            Store.organization.current &&
            Store.organization.current.models[Store.organization._currentModel]
          "
        >
          {{
            Store.organization.current.models[Store.organization._currentModel]
              .title
          }}
        </span>
        <span v-else>
          {{ $t("model.title.select") }}
        </span>

        <template #append>
          <i
            class="fi fi-sr-angles-up-down"
            style="font-size: 10px; opacity: 0.5"
          ></i>
        </template>
      </v-btn>
    </template>

    <template #default="{ isActive }">
      <v-card min-width="200" border>
        <div class="px-5 pt-2 text-body-2" style="opacity: 0.5">
          {{ $t("model.title.models") }}
        </div>
        <v-list class="pa-2" bg-color="transparent">
          <v-list-item
            v-for="(item, index) in Store.organization.current?.models"
            :key="index"
            :value="index"
            rounded="lg"
            @click="
              Store.organization.setCurrentModel(index);
              isActive.value = false;
            "
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>

            <template
              v-if="index === Store.organization._currentModel"
              v-slot:append
            >
              <i
                class="fi fi-br-check ml-5"
                style="font-size: 10px; opacity: 0.5"
              ></i>
            </template>
          </v-list-item>

          <v-list-item
            rounded="lg"
            @click="
              isActive.value = false;
              openCreateForm();
            "
          >
            <v-list-item-title>
              {{ $t("add") }}
            </v-list-item-title>

            <template v-slot:prepend>
              <i
                class="fi fi-br-plus mr-3"
                style="font-size: 10px; opacity: 0.5"
              ></i>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </template>
  </v-menu>

  <form-model-title ref="createForm" />
</template>
