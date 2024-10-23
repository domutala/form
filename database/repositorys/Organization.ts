import { Organization } from "database/entitys/Organization";
import { DataSource, Repository } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class OrganizationRepository extends Repository<Organization> {
  constructor(dataSource: DataSource) {
    super(Organization, dataSource.createEntityManager());
  }

  async _create(params: Organization) {
    let organization: Organization;

    if (params.id) organization = await this._findOne({ id: params.id });
    if (!organization) {
      organization = new Organization();
      params.members = [params.owner];
    }

    organization.id = params.id || params.id;
    organization.name = params.name || params.name;
    organization.owner = params.owner || params.owner;
    organization.members = params.members || params.members;

    await organization.save();
    return organization;
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
    const queryBuilder = this.createQueryBuilder("organization");
    queryBuilder.leftJoinAndSelect("organization.models", "models");

    if (params.id) {
      params.ids ||= [];
      params.ids.push(params.id);
    }
    if (params.ids) {
      queryBuilder.andWhere(
        `organization.id IN (${params.ids.map((id: string) => `'${id}'`).join(",")})`,
      );
    }

    if (params.member) {
      queryBuilder.andWhere(`'${params.member}'=ANY(members)`);
    }

    const sessions = await queryBuilder.getMany();

    return sessions;
  }
}
