<script lang="ts" setup>
const isDialogOpen = ref(false);
const submitting = ref(false);

const data = ref({ name: "" });

async function submit() {
  if (submitting.value) return;

  try {
    submitting.value = true;
    await Store.organization.create(data.value);
    isDialogOpen.value = false;
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <v-menu offset="5" :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn color="dark" variant="text" border rounded="pill" v-bind="props">
        <span v-if="!Store.organization.current">
          {{ $t("organization.selectOrganization") }}
        </span>
        <span>
          {{ Store.organization.current?.name }}
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
          {{ $t("organization.title.organizations") }}
        </div>
        <v-list class="pa-2" bg-color="transparent">
          <v-list-item
            v-for="(item, index) in Store.organization.organizations"
            :key="index"
            :value="index"
            rounded="lg"
            @click="
              Store.organization.setCurrent(index);
              isActive.value = false;
            "
          >
            <v-list-item-title>{{ item.name }}</v-list-item-title>

            <template
              v-if="item.id === Store.organization.current?.id"
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
              isDialogOpen = true;
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

  <v-dialog v-model="isDialogOpen" max-width="400" :persistent="submitting">
    <v-card>
      <v-container>
        <v-form ref="form" @submit.prevent="submit">
          <v-text-field
            v-model="data.name"
            label="name"
            :rules="[
              (v) => {
                if (!v) return 'required';
                return true;
              },
            ]"
          ></v-text-field>

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
                cancel
              </v-btn>
            </div>
            <div style="width: 100%">
              <v-btn type="submit" rounded="lg" :loading="submitting" block>
                submit
              </v-btn>
            </div>
          </div>
        </v-form>
      </v-container>
    </v-card>
  </v-dialog>
</template>
