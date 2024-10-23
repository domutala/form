import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Organization } from "database/entitys/Organization";
import { ModelRepository } from "database/repositorys/Model";
import { OrganizationRepository } from "database/repositorys/Organization";
import { Request } from "express";

@Injectable()
export class ModelService {
  constructor() {}

  @Inject() private repository: ModelRepository;
  @Inject() private organizationRepository: OrganizationRepository;
  @Inject(REQUEST) private request: Request;

  async create(body: any) {
    let organization: Organization;

    if (body.id) {
      const model = await this.repository._findOne({ id: body.id });
      organization = model.organization;
    }

    if (!organization) {
      organization = await this.organizationRepository._findOne({
        id: body.organizationId,
      });
    }

    if (!organization) throw new NotFoundException("organization_not_found");

    const model = await this.repository._create({
      ...body,
      createBy: this.request.user.uid,
      organization,
    });

    return model;
  }

  async get(body: any) {
    const model = await this.repository._findOne({ id: body.id });
    console.log(model);

    return model;
  }

  async remove(body: any) {
    const model = await this.repository._findOne({ id: body.id });
    if (!model) throw new NotFoundException("model_not_found");

    if (!model.organization.members.includes(this.request.user.uid)) {
      throw new UnauthorizedException("not_authorized");
    }

    await model.remove();

    return model;
  }

  async list() {
    const accounts = await this.repository._find({
      member: this.request.user.uid,
    });

    return accounts;
  }
}
