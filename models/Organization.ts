import type { Options } from "~/form";

export interface IOrganization {
  id: string;
  name: string;
  models: Options[];
  members: string[];
  owner: string;
}
