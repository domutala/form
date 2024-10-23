export default defineNuxtConfig({
  devtools: { enabled: true },

  ssr: false,

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_API_URL,
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId:
        process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
    },
  },

  modules: [
    "vuetify-nuxt-module",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/svg-sprite",
    "@nuxtjs/i18n",
    "dayjs-nuxt",
  ],

  app: {
    head: {
      titleTemplate: "%s %separator %siteName - %siteDescription",
      templateParams: {
        siteName: process.env.APP_NAME,
        siteDescription: "Automatiser et simplifier vos formulaires",
        separator: "·",
      },
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.svg" }],
    },
  },

  plugins: [],

  components: [
    { path: "~/components/ui", global: true, prefix: "ui" },
    { path: "~/components/form", global: true, prefix: "form" },
  ],

  css: [
    "animate.css/animate.min.css",
    "@flaticon/flaticon-uicons/css/all/all.css",
    "~/assets/styles/main.scss",
  ],

  i18n: {
    strategy: "no_prefix",
    dynamicRouteParams: false,
    compilation: { strictMessage: false },
    locales: [
      { code: "fr", name: "Français", file: "./locale/fr.lang.json" },
      { code: "en", name: "English", file: "./locale/en.lang.json" },
    ],
  },

  swiper: { modules: ["effect-cards"] },

  piniaPersistedstate: { storage: "localStorage" },
});
