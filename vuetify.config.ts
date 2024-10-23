import type { ExternalVuetifyOptions } from "vuetify-nuxt-module";
import colors from "vuetify/util/colors";

const primaryColor = "#004aeb";
const secondaryColor = "#ffff0000";

export default {
  labComponents: [
    "VStepperVertical",
    "VStepperVerticalItem",
    "VStepperVerticalActions",
  ],

  theme: {
    defaultTheme: "light",

    themes: {
      light: {
        dark: false,
        colors: {
          primary: primaryColor,
          secondary: secondaryColor,
          surface: "#e7e7e7",
          dark: colors.grey.darken4,
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: primaryColor,
          secondary: secondaryColor,
          dark: colors.grey.lighten5,
          background: "#0e0e0e",
        },
      },
    },
  },

  defaults: {
    VAppBar: {
      color: "background",
      elevation: "0",
      class: "border-b",
    },

    VNavigationDrawer: {
      VTooltip: {
        contentClass: "bg-background border rounded-pill px-2 py-0",
        contentProps: { style: { fontSize: "12px" } },

        VBtn: {
          size: "small",
          variant: "text",
          icon: true,
          color: "light",
        },
      },
    },

    VTooltip: {
      contentClass: "bg-background border rounded-pill px-2 py-0",
      contentProps: { style: { fontSize: "12px" } },
    },

    VBtn: {
      style: { "text-transform": "none" },
      variant: "flat",
      color: "primary",
    },
    VTextField: {
      variant: "outlined",
    },
    VTextarea: {
      variant: "outlined",
    },
    VSelect: {
      variant: "outlined",
    },
    VBottomSheet: {
      color: "background",
      bgColor: "background",
      inset: true,
    },

    VCard: {
      color: "background",
    },
  },
} satisfies ExternalVuetifyOptions;
