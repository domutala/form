<script lang="ts" setup>
const { t } = useI18n();
const auth = useAuth();
const { $firebase } = useNuxtApp();
const i18n = useI18n();

useSeoMeta({ title: t("userSettings") });

onMounted(() => {
  displayName.value = auth.user.value?.displayName || "";
  photoURI.value = { content: auth.user.value?.photoURL } as any;
});

const displayName = ref("");
const displayNameSubmitting = ref(false);
async function saveName() {
  if (displayNameSubmitting.value) return;
  if (!displayName.value) return;
  if (displayName.value === auth.user.value?.displayName) return;

  try {
    displayNameSubmitting.value = true;
    await auth.updateProfile({ displayName: displayName.value });
  } finally {
    displayNameSubmitting.value = false;
  }
}

const photoURI = ref<{
  name: string;
  type: string;
  size: number;
  content: string;
}>();
const photoURLSubmitting = ref(false);
function loadPhoto() {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/png;image/jpeg");

  function readFile() {
    const _files = input.files;
    if (!_files?.length) return;

    for (const file of _files) {
      const fileReader = new FileReader();

      fileReader.onload = () => {
        photoURI.value = {
          name: file.name,
          type: file.type,
          size: file.size,
          content: fileReader.result as string,
        };
      };

      fileReader.readAsDataURL(file);
    }
  }

  input.addEventListener("change", readFile);
  input.click();
}
async function savePhotoURL() {
  if (photoURLSubmitting.value) return;
  if (!displayName.value) return;
  if (photoURI.value?.content === auth.user.value?.photoURL) return;

  try {
    photoURLSubmitting.value = true;

    const result = await $firebase.storage.uploadFile(photoURI.value!);
    await auth.updateProfile({ photoURL: result?.url });

    photoURI.value!.content = result.url;
  } finally {
    photoURLSubmitting.value = false;
  }
}

const passwords = ref({ password: "", passwordConfirmation: "" });
const passwordSubmitting = ref(false);
async function savePassword() {
  if (passwordSubmitting.value) return;
  if (
    !passwords.value.password ||
    passwords.value.password !== passwords.value.passwordConfirmation
  ) {
    return;
  }

  try {
    passwordSubmitting.value = true;
    await auth.updatePassword(passwords.value.password);
    passwords.value = { password: "", passwordConfirmation: "" };

    Utils.Toast.push({ text: i18n.t("passwordUpdated"), color: "success" });
  } finally {
    passwordSubmitting.value = false;
  }
}
</script>

<template>
  <v-container class="my-10">
    <div class="d-flex flex-column ga-10" style="max-width: 400px">
      <div class="d-flex align-center ga-3">
        <v-avatar @click="loadPhoto" size="92" class="cursor-pointer">
          <v-img v-if="photoURI?.content" :src="photoURI.content"></v-img>
          <svg-icon v-else name="avatar" />
        </v-avatar>

        <v-btn
          v-if="photoURI?.content !== auth.user.value?.photoURL"
          rounded
          @click="savePhotoURL"
          :loading="photoURLSubmitting"
        >
          {{ $t("save") }}
        </v-btn>
      </div>

      <div>
        <v-text-field
          @keypress.enter="saveName"
          :label="$t('name')"
          v-model="displayName"
        >
          <template
            #append-inner
            v-if="displayName !== auth.user.value?.displayName"
          >
            <v-btn rounded @click="saveName" :loading="displayNameSubmitting">
              {{ $t("save") }}
            </v-btn>
          </template>
        </v-text-field>
      </div>

      <v-form @submit.prevent="savePassword">
        <div class="mb-3 text-h5">{{ $t("updateYourPassword") }}</div>
        <v-text-field
          :label="$t('password')"
          type="password"
          autocomplete="new-password"
          v-model="passwords.password"
        >
        </v-text-field>
        <v-text-field
          :label="$t('passwordConfirmation')"
          type="password"
          v-model="passwords.passwordConfirmation"
        >
        </v-text-field>

        <v-btn
          :disabled="
            !passwords.password ||
            passwords.password !== passwords.passwordConfirmation
          "
          :loading="passwordSubmitting"
          rounded="lg"
          type="submit"
        >
          {{ $t("save") }}
        </v-btn>
      </v-form>

      <div>
        <div class="mb-3 text-h5">{{ $t("theme.title") }}</div>

        <div class="d-flex align-center ga-2">
          <v-btn
            :variant="Store.app.mode.value === 'light' ? 'flat' : 'tonal'"
            color="dark"
            rounded="pill"
            @click="Store.app.setMode('light')"
          >
            <template #prepend>
              <i class="fi fi-sr-brightness"></i>
            </template>
            {{ $t("theme.light") }}
          </v-btn>
          <v-btn
            :variant="Store.app.mode.value === 'dark' ? 'flat' : 'tonal'"
            color="dark"
            rounded="pill"
            @click="Store.app.setMode('dark')"
          >
            <template #prepend>
              <i class="fi fi-sr-moon-stars"></i>
            </template>
            {{ $t("theme.dark") }}
          </v-btn>
          <v-btn
            :variant="!Store.app.mode.value ? 'flat' : 'tonal'"
            color="dark"
            rounded="pill"
            @click="Store.app.setMode(null)"
          >
            <template #prepend>
              <i class="fi fi-bs-computer-classic"></i>
            </template>
            {{ $t("theme.default") }}
          </v-btn>
        </div>
      </div>
    </div>
  </v-container>
</template>
