import { Model } from "database/entitys/Model";
import { DataSource, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ModelRepository extends Repository<Model> {
  constructor(dataSource: DataSource) {
    super(Model, dataSource.createEntityManager());
  }

  async _create(params: Model) {
    let model: Model;

    if (params.id) model = await this._findOne({ id: params.id });
    if (!model) model = new Model();

    model.id = params.id || model.id;
    model.title = params.title || model.title;
    model.schemaOptions = params.schemaOptions || model.schemaOptions;
    model.base = params.base || model.base;
    model.metas = params.metas || model.metas;
    model.createBy = params.createBy || model.createBy;
    model.organization = params.organization || model.organization;

    await model.save();
    return model;
  }

  async _findOne(params: { [x: string]: any }) {
    if (
      Object.values(params)
        .map((v) => v !== undefined)
        .includes(false)
    ) {
      return;
    }

    const sessions = await this._find(params);

    return sessions[0];
  }

  async _find(params: { [x: string]: any } = {}) {
    const queryBuilder = this.createQueryBuilder("model");
    queryBuilder.leftJoinAndSelect("model.organization", "organization");

    if (params.id) {
      params.ids ||= [];
      params.ids.push(params.id);
    }
    if (params.ids) {
      queryBuilder.andWhere(
        `model.id IN (${params.ids.map((id: string) => `'${id}'`).join(",")})`,
      );
    }

    if (params.member) {
      queryBuilder.andWhere(`'${params.member}'=ANY(members)`);
    }

    const sessions = await queryBuilder.getMany();

    return sessions;
  }
}
