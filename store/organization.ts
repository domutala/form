import { defineStore } from "pinia";
import type { Options } from "~/form";
import type { IOrganization } from "~/models/Organization";

const store = defineStore(
  "organization",
  () => {
    const organizations = ref<IOrganization[]>([]);

    const _current = ref(0);
    const current = computed(() => {
      return organizations.value[_current.value];
    });

    async function setCurrent(id?: number) {
      _current.value = id || 0;

      if (_current.value > organizations.value.length - 1) {
        _current.value = 0;
      }

      setCurrentModel(_currentModel.value);
    }

    const _currentModel = ref(0);
    function setCurrentModel(id?: number) {
      _currentModel.value = id || 0;

      if (
        !current.value ||
        _currentModel.value > current.value.models.length - 1
      ) {
        _currentModel.value = 0;
      }
    }

    function push(...values: IOrganization[]) {
      for (const value of values) {
        const i = organizations.value.findIndex((c) => c.id === value.id);
        if (i !== -1) organizations.value[i] = value;
        else organizations.value.push(value);
      }
    }

    function unshift(id: string) {
      const i = organizations.value.findIndex((c) => c.id === id);
      if (i !== -1) organizations.value.splice(i, 1);
    }

    function pushModel(...values: Options[]) {
      if (!organizations.value[_current.value]) return;

      const organizationId = organizations.value[_current.value].id;

      for (let i = 0; i < values.length; i++) {
        const value = values[i];
        // if (value.organizationId === organizationId) {
        const k = organizations.value[_current.value].models.findIndex(
          (c) => c.id === value.id
        );
        if (k !== -1) organizations.value[_current.value].models[k] = value;
        else organizations.value[_current.value].models.push(value);
      }
      // }
    }

    function unshiftModel(id: string) {
      const i = organizations.value[_current.value].models.findIndex(
        (c) => c.id === id
      );
      if (i !== -1) organizations.value[_current.value].models.splice(i, 1);
      setCurrentModel(_currentModel.value);
    }

    async function init() {
      clean();
      await list();
    }

    async function create(params: { name: string; id?: string }) {
      const organization = await Api.fetch<IOrganization>({
        method: "post",
        body: params,
        url: "organization/create",
      });

      push(organization);
    }
    async function createModel(params: Partial<Options>) {
      const model = await Api.fetch<Options>({
        method: "post",
        body: params,
        url: "model/create",
      });

      pushModel(model);

      return model;
    }

    async function remove(params: { id: string }) {
      const organization = await Api.fetch<IOrganization>({
        method: "post",
        body: params,
        url: `organization/remove/${params.id}`,
      });

      unshift(params.id);

      return organization;
    }
    async function removeModel(params: { id: string }) {
      const model = await Api.fetch<Options>({
        method: "post",
        url: `model/remove/${params.id}`,
      });

      unshiftModel(params.id);

      return model;
    }

    async function list() {
      try {
        const organizations = await Api.fetch<IOrganization[]>({
          url: "organization",
        });

        push(...organizations);
        setCurrent(_current.value);
      } catch (error) {}
    }

    function clean() {
      organizations.value = [];
    }

    return {
      organizations,

      clean,
      init,

      _current,
      current,
      setCurrent,
      _currentModel,
      setCurrentModel,

      createModel,
      removeModel,
      pushModel,
      unshiftModel,

      push,
      unshift,
      fetch,
      create,
      remove,

      list,
    };
  },
  { persist: true }
);

export default store;
