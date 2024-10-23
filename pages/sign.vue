<script setup lang="ts">
import type { VForm } from "vuetify/components";

const { login, signupWithEmailAndPassword, sendPasswordResetEmail } = useAuth();
const router = useRouter();

const submitting = ref(false);
const forgetPasswordForm = ref<VForm>();
const signupForm = ref<VForm>();
const signinForm = ref<VForm>();
const signupData = ref({
  email: "",
  displayName: "",
  password: "",
  passwordConfirmation: "",
});
const signinData = ref({
  email: "",
  password: "",
});
const forgetPasswordData = ref({ email: "" });

const side = computed(() => {
  const side = (router.currentRoute.value.query.side as string) || "signin";
  return side;
});

async function submit(provider: "github" | "google") {
  try {
    await login(provider);
    useRouter().replace({ name: "dashboard" });
  } catch (error) {}
}

async function signup() {
  if (!signupForm.value) return;

  await signupForm.value.validate();
  if (!signupForm.value.isValid) return;

  try {
    submitting.value = true;
    await signupWithEmailAndPassword(signupData.value);
    useRouter().replace({ name: "dashboard" });
  } finally {
    submitting.value = false;
  }
}

async function signin() {
  if (!signinForm.value) return;

  await signinForm.value.validate();
  if (!signinForm.value.isValid) return;

  try {
    submitting.value = true;
    await login(signinData.value);
    useRouter().replace({ name: "dashboard" });
  } finally {
    submitting.value = false;
  }
}

async function forgetPassword() {
  if (!forgetPasswordForm.value) return;

  await forgetPasswordForm.value.validate();
  if (!forgetPasswordForm.value.isValid) return;

  try {
    submitting.value = true;
    await sendPasswordResetEmail(forgetPasswordData.value);
    Utils.Toast.push({ text: "email_sent" });
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <v-app>
    <div class="pg-sign-row">
      <div class="pg-sign-col">
        <div>
          <svg-icon name="logo" width="92" height="92" />
          <div class="text-h4 font-weight-bold mb-5">{{ $t("login") }}</div>
        </div>
      </div>
      <div class="pg-sign-col">
        <div>
          <v-form
            v-if="side === 'signup'"
            ref="signupForm"
            @submit.prevent="signup"
          >
            <v-text-field
              :placeholder="$t('name')"
              class="mb-2"
              v-model="signupData.displayName"
              :rules="[
                (v) => {
                  if (!v) return $t('fieldRequired');
                  return true;
                },
              ]"
            ></v-text-field>
            <v-text-field
              type="email"
              :placeholder="$t('email')"
              class="mb-2"
              v-model="signupData.email"
              :rules="[
                (v) => {
                  if (!v) return $t('fieldRequired');
                  return true;
                },
              ]"
            ></v-text-field>
            <v-text-field
              :placeholder="$t('password')"
              type="password"
              class="mb-2"
              v-model="signupData.password"
              :rules="[
                (v) => {
                  if (!v) return $t('fieldRequired');
                  return true;
                },
              ]"
            ></v-text-field>
            <v-text-field
              :placeholder="$t('passwordConfirmation')"
              type="password"
              class="mb-2"
              v-model="signupData.passwordConfirmation"
              :rules="[
                (v) => {
                  if (v !== signupData.password) return $t('passwordNotMatch');
                  return true;
                },
              ]"
            ></v-text-field>

            <div class="d-flex align-center ga-4">
              <v-btn rounded type="submit">{{ $t("signup") }}</v-btn>

              <a
                class="cursor-pointer"
                @click="$router.push({ query: { side: 'signin' } })"
              >
                {{ $t("signin") }}
              </a>
            </div>
          </v-form>
          <v-form
            v-else-if="side === 'signin'"
            ref="signinForm"
            @submit.prevent="signin"
          >
            <v-text-field
              type="email"
              :placeholder="$t('email')"
              v-model="signinData.email"
              :rules="[
                (v) => {
                  if (!v) return $t('fieldRequired');
                  return true;
                },
              ]"
            ></v-text-field>
            <v-text-field
              :placeholder="$t('password')"
              type="password"
              class="mb-2"
              v-model="signinData.password"
              :rules="[
                (v) => {
                  if (!v) return $t('fieldRequired');
                  return true;
                },
              ]"
            ></v-text-field>

            <div class="mt-3">
              <v-btn rounded type="submit" :loading="submitting">
                {{ $t("signin") }}
              </v-btn>

              <div class="d-flex flex-wrap align-center ga-4 mt-3">
                <a
                  class="cursor-pointer"
                  @click="$router.push({ query: { side: 'signup' } })"
                >
                  {{ $t("signup") }}
                </a>
                <a
                  class="cursor-pointer"
                  @click="$router.push({ query: { side: 'forgetPassword' } })"
                >
                  {{ $t("forgetPassword") }}
                </a>
              </div>
            </div>
          </v-form>
          <v-form
            v-else-if="side === 'forgetPassword'"
            ref="forgetPasswordForm"
            @submit.prevent="forgetPassword"
          >
            <v-text-field
              type="email"
              :placeholder="$t('email')"
              v-model="forgetPasswordData.email"
              :rules="[
                (v) => {
                  if (!v) return $t('fieldRequired');
                  return true;
                },
              ]"
            ></v-text-field>

            <div class="d-flex align-center ga-4 mt-3">
              <v-btn rounded type="submit" :loading="submitting">
                {{ $t("send") }}
              </v-btn>

              <a
                class="cursor-pointer"
                @click="$router.push({ query: { side: 'signin' } })"
              >
                {{ $t("signin") }}
              </a>
            </div>
          </v-form>
        </div>
      </div>
      <div class="pg-sign-col">
        <div>
          <v-btn
            @click="submit('github')"
            size="x-large"
            variant="text"
            color="dark"
            class="border mb-2"
            rounded
            block
          >
            <template #prepend>
              <i class="fi fi-brands-github" style="font-size: 24px"></i>
            </template>
            {{ $t("signWithGithub") }}
          </v-btn>
          <v-btn
            @click="submit('google')"
            size="x-large"
            variant="text"
            color="dark"
            class="border"
            rounded
            block
          >
            <template #prepend>
              <i class="fi fi-brands-google" style="font-size: 24px"></i>
            </template>
            {{ $t("signWithGoogle") }}
          </v-btn>
        </div>
      </div>
    </div>
  </v-app>
</template>

<style lang="scss">
.pg-sign-row {
  display: flex;
  flex-wrap: wrap;
  width: 772px;
  max-width: 90%;
  margin: 50px auto;
  gap: 30px 0;

  .pg-sign-col {
    width: 50%;

    &:first-child {
      width: 100%;
    }

    @media (max-width: 662px) {
      width: 100%;
    }

    > div {
      width: 90%;
      margin: auto;
    }
  }
}
</style>
