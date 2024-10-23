import { Column, Entity, ManyToOne } from "typeorm";
import { Base } from "./Base";
import { Model } from "./Model";

@Entity()
export class Input extends Base {
  @Column({ type: "jsonb" })
  value: any;

  @Column({ type: "float", default: 0 })
  balance: number;

  @ManyToOne(() => Model, (model) => model.inputs)
  model: Model;
}
