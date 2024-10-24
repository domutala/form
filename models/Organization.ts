import type { Options } from "~/form";

export interface IOrganization {
  id: string;
  name: string;
  models: Options[];
  members: IMember[];
  owner: string;
}

export interface IMember {
  uid: string;
  admin?: boolean;
  state: "invited" | "disabled" | "accepted" | "declined" | "leave";
  owner?: boolean;
}
