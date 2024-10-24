<script lang="ts" setup>
const runtimeConfig = useRuntimeConfig();
const i18n = useI18n();
const functionalitys = i18n.t("fonctionnalys");
</script>

<template>
  <v-app
    style="
      background: linear-gradient(
        135deg,
        rgba(56, 103, 214, 0.03),
        rgba(91, 214, 255, 0.02)
      );
    "
  >
    <v-app-bar
      style="
        backdrop-filter: blur(0.9rem);
        background-color: rgba(var(--v-theme-background), 0.4) !important;
        border-bottom: 0 !important;
      "
    >
      <v-app-bar-title>
        <nuxt-link
          class="d-flex align-center ga-2 text-dark font-weight-bold text-h5"
          :to="{ name: 'index' }"
        >
          <svg-icon name="logo" width="32" height="32" />
          {{ runtimeConfig.public.appName }}
        </nuxt-link>
      </v-app-bar-title>

      <v-btn rounded color="dark"> pricing </v-btn>
      <v-btn rounded variant="flat" class="mr-10 ml-2"> get started </v-btn>
    </v-app-bar>

    <v-main style="padding-top: 0">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa magni
      eaque earum maxime sint tempora reprehenderit maiores facilis quae quidem
      recusandae, cupiditate qui soluta ullam, est illo, aperiam dolores
      placeat.
      <v-container
        class="text-center d-flex flex-column align-center justify-center hero-section"
        fluid
      >
        <v-chip
          color="warning"
          variant="text"
          class="mb-3 border border-opacity-25 border-md border-warning"
        >
          Constructeur de formulaire
        </v-chip>
        <h1 class="hero-title">Lorem ipsum dolor <br />sit amet consectetur</h1>
        <p class="hero-subtitle">
          This is a demo application built with supastarter. It will save you a
          lot of time and effort building your next SaaS.
        </p>
        <v-btn
          :to="{ name: 'dashboard' }"
          color="primary"
          size="x-large"
          class="mt-4"
          rounded="lg"
        >
          Get started
        </v-btn>
      </v-container>

      <v-container class="py-16" fluid>
        <h1
          style="
            font-size: calc(1.2rem + 2vw);
            font-weight: bold;
            line-height: 1;
            text-align: center;
          "
        >
          Lorem ipsum dolor sit amet consectetur
        </h1>
        <p
          style="
            font-size: calc(0.5rem + 1vw);
            margin: 20px auto;
            max-width: 700px;
            text-align: center;
          "
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt et eaque
          quae officia aspernatur ducimus voluptatum placeat deleniti
        </p>

        <div class="d-flex flex-wrap">
          <div v-for="i in 6" :key="i" class="w-100 w-sm-50">
            <div class="border rounded-xl pa-8 ma-3 border-md">
              <i class="fi fi-tr-shield-check text-h4"></i>
              <div
                class="font-weight-bold mt-5 mb-3"
                style="font-size: 22px; line-height: 1"
              >
                Rem est expedita ipsum beatae aspernatur
              </div>
              <div>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Provident consequatur inventore consectetur est nostrum
              </div>
            </div>
          </div>
        </div>
      </v-container>

      <v-container class="py-16">
        praesentium deserunt nostrum doloribus nam corrupti recusandae libero.
        Rerum. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Labore
        saepe quibusdam ut, eligendi assumenda, molestiae blanditiis non
        possimus dignissimos eum consequuntur praesentium deserunt nostrum
        doloribus nam corrupti recusandae libero. Rerum. Lorem, ipsum dolor sit
        amet consectetur adipisicing elit. Labore saepe quibusdam ut, eligendi
        assumenda, molestiae blanditiis non possimus dignissimos eum
        consequuntur praesentium deserunt nostrum doloribus nam corrupti
        recusandae libero. Rerum. Lorem, ipsum dolor sit amet consectetur
        adipisicing elit. Labore saepe quibusdam ut, eligendi assumenda,
        molestiae blanditiis non possimus dignissimos eum consequuntur
        praesentium deserunt nostrum doloribus nam corrupti recusandae libero.
        Rerum.
      </v-container>
    </v-main>
    <v-footer class="bg-background border-t">
      © 2024 {{ runtimeConfig.public.appName }}

      <v-spacer></v-spacer>
      <v-btn
        icon
        size="small"
        color="dark"
        variant="text"
        href="https://www.linkedin.com/company/tarico"
        target="_blank"
      >
        <svg-icon name="linkedin" width="22" height="22" />
      </v-btn>
    </v-footer>
  </v-app>
</template>

<style scoped>
.hero-section {
  min-height: 100vh;
  width: 100vw;
  padding-top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative; /* Permet de positionner les éléments d'arrière-plan */

  /* Effet léger de lumière ou d'ombre */
  /* box-shadow: inset 0 0 200px rgba(255, 255, 255, 0.1); */
}

.hero-title {
  font-size: calc(3rem + 2vw);
  font-weight: bold;
  line-height: 1;
}

.hero-subtitle {
  font-size: calc(0.9rem + 1vw);
  margin-top: 20px;
  max-width: 700px;
}

/* Media queries pour petits écrans */
@media (max-width: 600px) {
  .hero-title {
    font-size: calc(2rem + 1vw);
  }

  .hero-subtitle {
    font-size: calc(0.8rem + 0.5vw);
  }
}
</style>
