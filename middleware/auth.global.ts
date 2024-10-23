// middleware/auth.global.ts

import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, observeAuthState } = useAuth();

  // Surveiller l'état de l'utilisateur au démarrage
  await observeAuthState();

  // Vérifier si le chemin commence par "/dashboard"
  if (to.path.startsWith("/dashboard")) {
    // Si l'utilisateur n'est pas authentifié, rediriger vers la page de sign
    if (!user.value && to.path !== "/sign") {
      return navigateTo("/sign");
    }
  }
});
