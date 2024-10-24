<script lang="ts" setup>
import { onMounted } from "vue";

const model = computed(() => {
  return Store.organization.current?.models[Store.organization._currentModel];
});
const auth = useAuth();
const router = useRouter();
const i18n = useI18n();
const initing = ref(false);

const aside = computed(() => {
  if (router.currentRoute.value.name !== "dashboard") return;

  const side = (router.currentRoute.value.query.side as string) || "update";
  return side;
});

watch(() => Store.organization._currentModel, onCurrentModel);
watch(() => Store.organization._current, onCurrentModel);
function onCurrentModel() {
  if (router.currentRoute.value.name === "dashboard") {
    router.push({ name: "dashboard", query: { side: "update" } });
  }
}

onMounted(mounted);
async function mounted() {
  try {
    initing.value = true;
    await Store.organization.init();
  } finally {
    initing.value = false;
  }
}

function copyLinkModel() {
  if (!model.value) return;

  navigator.clipboard
    .writeText(`${window.location.origin}/input/${model.value.id}`)
    .then(() => {
      Utils.Toast.push({ text: i18n.t("successCopied"), color: "success" });
    });
}
</script>

<template>
  <ui-loading-page v-if="initing" />
  <v-layout v-else-if="auth.user.value" class="rounded rounded-md">
    <v-navigation-drawer color="background" permanent rail>
      <template #prepend>
        <div
          class="w-100 mb-3 d-flex align-center justify-center"
          style="height: 65px"
        >
          <v-btn
            color="dark"
            variant="text"
            size="small"
            icon
            @click="$router.push({ name: 'dashboard' })"
          >
            <svg-icon name="logo" width="32" height="32" />
          </v-btn>
        </div>
      </template>

      <div class="w-100 d-flex flex-column ga-2 align-center mt-5">
        <v-tooltip v-if="model" :text="$t('model.title.update')">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              @click="
                $router.push({ name: 'dashboard', query: { side: 'update' } })
              "
            >
              <i
                class="fi fi-tc-edit"
                :class="aside === 'update' ? 'text-primary' : ''"
                style="font-size: 18px"
              ></i>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip v-if="model" :text="$t('model.title.settings')">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              @click="
                $router.push({
                  name: 'dashboard',
                  query: { side: 'settings' },
                })
              "
            >
              <!-- <i class="fi fi-tr-list-timeline"></i> -->
              <i
                class="fi fi-tc-settings"
                :class="aside === 'settings' ? 'text-primary' : ''"
                style="font-size: 18px"
              ></i>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip v-if="model" :text="$t('model.title.inputs')">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              @click="
                $router.push({
                  name: 'dashboard',
                  query: { side: 'inputs' },
                })
              "
            >
              <i
                class="fi fi-tr-list-timeline"
                :class="aside === 'inputs' ? 'text-primary' : ''"
                style="font-size: 20px"
              ></i>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip v-if="model" :text="$t('model.title.test')">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              :disabled="!model?.schemaOptions?.length"
              @click="
                $router.push({ name: 'dashboard', query: { side: 'test' } })
              "
            >
              <i
                class="fi fi-tc-document-signed"
                :class="aside === 'test' ? 'text-primary' : ''"
                style="font-size: 20px"
              ></i>
            </v-btn>
          </template>
        </v-tooltip>
      </div>

      <template #append>
        <div
          v-if="$firebase.auth.currentUser"
          class="w-100 d-flex ga-2 flex-column align-center pb-3"
        >
          <v-tooltip :text="$t('organization.title.organizations')">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                @click="$router.push({ name: 'dashboard-organizations' })"
              >
                <i
                  class="fi fi-tr-boxes"
                  :class="
                    $route.name === 'dashboard-organizations'
                      ? 'text-primary'
                      : ''
                  "
                  style="font-size: 20px"
                ></i>
              </v-btn>
            </template>
          </v-tooltip>
          <v-tooltip :text="$t('userSettings')">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                @click="$router.push({ name: 'dashboard-user-settings' })"
              >
                <i
                  class="fi fi-tr-user-gear"
                  :class="
                    $route.name === 'dashboard-user-settings'
                      ? 'text-primary'
                      : ''
                  "
                  style="font-size: 20px"
                ></i>
              </v-btn>
            </template>
          </v-tooltip>
          <v-tooltip :text="$t('logout')">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" @click="auth.logout()">
                <i class="fi fi-tc-power" style="font-size: 18px"></i>
              </v-btn>
            </template>
          </v-tooltip>

          <v-tooltip
            :text="
              $firebase.auth.currentUser.displayName
                ? $firebase.auth.currentUser.displayName
                : undefined
            "
          >
            <template v-slot:activator="{ props }">
              <v-avatar size="32" v-bind="props">
                <v-img
                  v-if="$firebase.auth.currentUser.photoURL"
                  :src="$firebase.auth.currentUser.photoURL"
                ></v-img>
                <svg-icon v-else name="avatar" />
              </v-avatar>
            </template>
          </v-tooltip>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-title>
        <div
          v-if="$route.name === 'dashboard'"
          class="d-flex align-center ga-2"
        >
          <ui-organization-selecter />
          <ui-model-selecter />
        </div>

        <div v-else>
          <span v-if="$route.name === 'dashboard-organizations'">
            {{ $t("organization.title.organizations") }}
          </span>
          <span v-else-if="$route.name === 'dashboard-user-settings'">
            {{ $t("userSettings") }}
          </span>
        </div>
      </v-app-bar-title>

      <v-tooltip
        v-if="model && $route.name === 'dashboard'"
        :text="$t('model.title.inputLink')"
        location="bottom"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            size="x-small"
            variant="text"
            color="dark"
            icon
            v-bind="props"
            @click="copyLinkModel()"
          >
            <i class="fi fi-tr-link-alt" style="font-size: 18px"></i>
          </v-btn>
        </template>
      </v-tooltip>

      <div style="width: 25px"></div>
    </v-app-bar>

    <v-main>
      <NuxtPage v-if="$route.name !== 'dashboard'" />
      <div v-else>
        <div
          v-if="!Store.organization.current?.models.length"
          class="d-flex align-center justify-center"
          style="margin-top: 100px"
        >
          <i
            class="fi fi-tc-document-signed"
            style="font-size: 92px; opacity: 0.3"
          ></i>
        </div>
        <div
          v-else-if="model"
          :key="model.id"
          style="width: 662px; max-width: 90%; margin: 50px auto"
        >
          <form-model-update v-if="aside === 'update'" />
          <form-model-form
            v-else-if="aside === 'test'"
            :model="model"
            test-mode
          />
          <div v-else-if="aside === 'settings'">
            <form-model-retitle />
            <form-model-remove />
          </div>
        </div>
      </div>
    </v-main>
  </v-layout>
</template>
