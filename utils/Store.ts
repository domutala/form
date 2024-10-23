import app from "~/store/app";
import organization from "~/store/organization";
import session from "~/store/session";

import type { PiniaPluginContext } from "pinia";
import { Preferences } from "@capacitor/preferences";
class Store {
  get app() {
    return app();
  }
  get organization() {
    return organization();
  }
  get session() {
    return session();
  }
}

const store = new Store();
export default store;

export async function beforeRestore(ctx: PiniaPluginContext) {
  ctx.store.$subscribe(async (mutation) => {
    const state = store[ctx.store.$id as "app"].$state;
    await Preferences.set({
      key: ctx.store.$id,
      value: JSON.stringify(state),
    });
  });

  const value = await Preferences.get({ key: ctx.store.$id });
  if (value.value) {
    sessionStorage.setItem(ctx.store.$id, value.value);
  }
}
