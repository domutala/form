export interface ApiFetcherParams {
  body?: any;
  url?: string;
  headers?: { [key: string]: any };
  method?: "post" | "get";
  module?: string;
}

type Newable = new (...args: any[]) => any;
export type ApiFetcher = <T = any>(
  params: ApiFetcherParams,
  model?: Newable
) => Promise<T>;

const fetcher: ApiFetcher = async (params) => {
  try {
    params.headers ||= {};
    params.body ||= {};

    const { user } = useAuth();
    if (user.value) {
      params.headers.authorization = `Bearer ${await user.value.getIdToken()}`;
    }

    const _params: { [key: string]: any } = {
      body: params.method === "post" ? params.body : undefined,
      method: params.method || "get",
      headers: params.headers,
      url: params.url || "/",
    };

    let response = await $fetch(_params.url, {
      baseURL: useRuntimeConfig().public.apiUrl,
      ..._params,
    });

    return response;
  } catch (error: any) {
    if (error.data) {
      Utils.Toast.push({ text: error.data.message, color: "red" });
    }

    throw error;
  }
};

export default { fetch: fetcher };
