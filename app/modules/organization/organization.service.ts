import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { OrganizationRepository } from "database/repositorys/Organization";
import { Request } from "express";

@Injectable()
export class OrganizationService {
  @Inject(REQUEST) private request: Request;
  @Inject() private repository: OrganizationRepository;

  async create(body: any) {
    if (body.id) {
      const org = await this.repository._findOne({ id: body.id });
      if (org && org.owner !== this.request.user.uid) {
        throw new UnauthorizedException("not_authorized");
      }
    }

    const organization = await this.repository._create({
      ...body,
      owner: this.request.user.uid,
    });

    return await this.repository._findOne({ id: organization.id });
  }

  async remove(body: any) {
    const organization = await this.repository._findOne({ id: body.id });
    if (!organization) throw new NotFoundException("organization_not_found");

    if (organization.owner !== this.request.user.uid) {
      throw new UnauthorizedException("not_authorized");
    }

    await organization.remove();

    return organization;
  }

  async list() {
    const organizations = await this.repository._find({
      member: this.request.user.uid,
    });

    return await this.repository._removeUnaccessibleData(
      organizations,
      this.request.user.uid,
    );
  }
}
