import type { Model } from "./interfaces/Model";
import type { SchemaOptions, Schema } from "./interfaces/Schema";

import validators from "./validators";
export { default as validators } from "./validators";

export interface Options {
  id: string;

  title: string;

  schemaOptions?: SchemaOptions[];

  base?: { [schemaKey: string]: any };

  metas?: { [key: string]: any };

  organizationId: string;

  onSubmit?(model: Model): void;

  onFormValuesChanged?(model: Model): void;
}

export async function create({
  id,
  title,
  schemaOptions = [],
  base = {},
  metas = {},
  onSubmit,
  onFormValuesChanged,
}: Options) {
  const schemas: Schema[] = [];
  for (let i = 0; i < schemaOptions.length; i++) {
    const schemaOption = schemaOptions[i];

    const schema: Schema = {
      key: schemaOption.key,
      events: schemaOption.events || {},
      interface: schemaOption.interface || {},
      validators: schemaOption.validators || [],
      errors: [],
    };

    schemas.push(schema);
  }

  let model: Model = {
    id,
    title,
    schemas: schemas,
    formValues: base,
    isFormValid: true,
    schemasIndex: {},
    metas,

    async mount(form?: HTMLFormElement) {
      this.el = form;
      let _this = this;

      for (let i = 0; i < _this.schemas.length; i++) {
        const schema = _this.schemas[i];

        if (
          typeof schema.default !== "undefined" &&
          typeof _this.formValues[schema.key] === "undefined"
        ) {
          this.formValues[schema.key] = schema.default;
        }
      }

      async function runOnMountedFunctions() {
        for (let i = 0; i < schemas.length; i++) {
          const schema = schemas[i];

          if (window) {
            const el = document.querySelector(
              `[formons-shema="${schema.key}"]`
            );

            if (el) schema.interface.el = el;
          }

          if (schema.events.onMounted) {
            _this = await schema.events.onMounted(schema.key, model);
          }

          schemas[i] = schema;
        }
      }

      await runOnMountedFunctions();

      if (window && _this.el) {
        _this.el?.addEventListener("submit", (e) => {
          e.preventDefault();
          submit();
        });
      }

      return _this;
    },

    submit() {
      this.el?.submit();
    },

    async validate(key?: string) {
      if (key) await runValidator(key);
      else await runValidators();
      return this.isFormValid;
    },
  };

  function setSchemasIndex() {
    function schemaIndexGetter() {
      const schemasIndex = model.schemas.reduce((obj, schema, index) => {
        obj[schema.key] = index;
        return obj;
      }, {} as { [x: string]: number });

      return schemasIndex;
    }
    function schemaIndexSetter() {
      return true;
    }
    Object.defineProperty(model, "schemasIndex", {
      get: schemaIndexGetter,
      set: schemaIndexSetter,
      enumerable: true,
      configurable: true,
    });
  }
  setSchemasIndex();

  function setIsFormValid() {
    function getter() {
      const isValid = !model.schemas.some(
        (item) => item.errors && item.errors.length > 0
      );

      return isValid;
    }
    function setter() {
      return true;
    }
    Object.defineProperty(model, "isFormValid", {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  }
  setIsFormValid();

  function createProxy() {
    const proxyHandler = {
      set(obj: any, prop: string, value: any) {
        if (
          Object.prototype.toString.call(value) === "[object Object]" ||
          Array.isArray(value)
        ) {
          obj[prop] = new Proxy(value, proxyHandler);
        } else obj[prop] = value;

        if (onFormValuesChanged) onFormValuesChanged(model);

        return true;
      },
    };

    function buildProxy(obj: Array<any> | Object) {
      const proxy = new Proxy(obj, proxyHandler);
      for (const key in proxy) {
        if (Object.prototype.hasOwnProperty.call(proxy, key)) {
          if (
            Object.prototype.toString.call(proxy[key]) === "[object Object]" ||
            Array.isArray(proxy[key])
          ) {
            proxy[key] = new Proxy(proxy[key], proxyHandler);
          }
        }
      }

      return proxy;
    }

    model.formValues = buildProxy(model.formValues);
  }
  createProxy();

  async function runValidator(key: string) {
    const index = model.schemasIndex[key];
    const schema = schemas[index];

    if (schema) {
      schema.errors = [];

      for (let v = 0; v < schema.validators.length; v++) {
        const validator = schema.validators[v];
        const fn = validators[validator.fn as "required"] as (
          model: Model,
          ...args: any
        ) => Model | Promise<Model>;
        if (fn) model = await fn(model, schema.key, ...(validator.args || []));
      }
    }
  }

  async function runValidators() {
    for (const key in model.schemasIndex) {
      if (Object.prototype.hasOwnProperty.call(model.schemasIndex, key)) {
        runValidator(key);
      }
    }
  }

  async function submit() {
    if (model.el) {
      async function runOnBeforeSubmitFunctions() {
        for (let i = 0; i < schemas.length; i++) {
          const schema = schemas[i];
          if (schema.events.onBeforeSubmit) {
            model = await schema.events.onBeforeSubmit(schema.key, model);
          }
        }
      }

      await runOnBeforeSubmitFunctions();
      await runValidators();

      if (onSubmit) onSubmit(model);
    }
  }

  /**
   * Run onModelCreate functions
   */
  async function runOnModelCreateFunctions() {
    for (let i = 0; i < model.schemas.length; i++) {
      model.schemas[i].errors = [];
      if (model.schemas[i].events.onModelCreated) {
        model = await model.schemas[i].events.onModelCreated!(
          model.schemas[i].key,
          model
        );
      }
    }
  }

  await runOnModelCreateFunctions();

  return model;
}