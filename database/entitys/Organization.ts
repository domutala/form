import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { Base } from "./Base";
import { Model } from "./Model";

@Entity()
export class Organization extends Base {
  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar" })
  owner: string;

  @OneToMany(() => Model, (model) => model.organization)
  models: Model[];

  @Column({ type: "varchar", array: true, default: "{}" })
  members: string[];
}
