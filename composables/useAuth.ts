// composable/useAuth.ts

import {
  signOut,
  onAuthStateChanged,
  type User,
  GithubAuthProvider,
  signInWithPopup,
  GoogleAuthProvider,
  browserLocalPersistence,
  OAuthProvider,
  signInWithCredential,
  OAuthCredential,
  type UserCredential,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
} from "firebase/auth";

export const useAuth = () => {
  const { $firebase } = useNuxtApp();
  const user = useState<User | null>(
    "user",
    () => $firebase.auth.currentUser || null
  );

  async function setPersist() {
    await $firebase.auth.setPersistence(browserLocalPersistence);
  }

  async function _sendPasswordResetEmail(params: { email: string }) {
    try {
      await sendPasswordResetEmail($firebase.auth, params.email);
    } catch (e) {
      throw e;
    }
  }

  async function login(
    provider:
      | "google"
      | "github"
      | { email: string; password: string }
      | OAuthCredential
  ): Promise<UserCredential> {
    async function onError(error: any) {
      if (error.code === "auth/account-exists-with-different-credential") {
        const credential = OAuthProvider.credentialFromError(error);
        if (credential) return await login(credential);
      }

      throw error;
    }

    async function onSuccess(result: UserCredential) {
      user.value = result.user;
      return result;
    }

    if (provider instanceof OAuthCredential) {
      try {
        const result = await signInWithCredential($firebase.auth, provider);
        return await onSuccess(result);
      } catch (e) {
        throw e;
        // return await onError(e);
      }
    } else if (typeof provider === "string") {
      const providers = {
        google: GoogleAuthProvider,
        github: GithubAuthProvider,
      };

      const _provider = new providers[provider]();
      await setPersist();

      try {
        const result = await signInWithPopup($firebase.auth, _provider);
        return await onSuccess(result);
      } catch (e) {
        throw e;
        // return await onError(e);
      }
    } else {
      await setPersist();

      try {
        const result = await signInWithEmailAndPassword(
          $firebase.auth,
          provider.email,
          provider.password
        );

        return await onSuccess(result);
      } catch (e) {
        throw e;
        // return await onError(e);
      }
    }
  }

  async function _signupWithEmailAndPassword(params: {
    email: string;
    password: string;
    displayName: string;
  }) {
    try {
      const result = await createUserWithEmailAndPassword(
        $firebase.auth,
        params.email,
        params.password
      );

      user.value = result.user;

      await _updateProfile({ displayName: params.displayName });

      return result;
    } catch (error) {}
  }

  async function _updateProfile(profile: {
    displayName?: string;
    photoURL?: string;
  }) {
    try {
      await updateProfile(user.value!, profile);
      user.value = $firebase.auth.currentUser;
    } catch (e) {
      throw e;
    }
  }

  async function _updatePassword(password: string) {
    try {
      await updatePassword($firebase.auth.currentUser!, password);
    } catch (e) {
      throw e;
    }
  }

  // Déconnexion
  const logout = async () => {
    try {
      await signOut($firebase.auth);

      await Store.app.clean();
      await Store.organization.clean();

      user.value = null;

      useRouter().push({ name: "sign" });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Observer l'état de l'utilisateur
  const observeAuthState = async () => {
    return new Promise<void>((resolve) => {
      onAuthStateChanged($firebase.auth, (firebaseUser) => {
        user.value = firebaseUser;
        resolve();
      });
    });
  };

  return {
    user,
    login,
    logout,
    updateProfile: _updateProfile,
    observeAuthState,
    signupWithEmailAndPassword: _signupWithEmailAndPassword,
    sendPasswordResetEmail: _sendPasswordResetEmail,
    updatePassword: _updatePassword,
  };
};
