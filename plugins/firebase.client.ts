// plugins/firebase.client.ts

import { initializeApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadString,
} from "firebase/storage";

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();

  const config = {
    apiKey: runtimeConfig.public.firebaseApiKey,
    authDomain: runtimeConfig.public.firebaseAuthDomain,
    projectId: runtimeConfig.public.firebaseProjectId,
    storageBucket: runtimeConfig.public.firebaseStorageBucket,
    messagingSenderId: runtimeConfig.public.firebaseMessagingSenderId,
    appId: runtimeConfig.public.firebaseAppId,
  };

  // Initialiser Firebase
  const app = initializeApp(config as FirebaseOptions);

  // Initialiser Firebase Auth
  const auth = getAuth(app);

  const storage = getStorage(app);

  interface IFile {
    name: string;
    type: string;
    size: number;
    content: string;
  }
  const _storage = {
    async uploadFile(file: IFile) {
      try {
        const storageRef = ref(storage, file.name);
        const result = await uploadString(storageRef, file.content, "data_url");

        const url = await getDownloadURL(storageRef);

        return { url, result };
      } catch (e) {
        throw e;
      }
    },
  };

  return {
    provide: { firebase: { app, auth, storage: _storage } },
  };
});
