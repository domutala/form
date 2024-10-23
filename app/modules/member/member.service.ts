import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { FirebaseAuthService } from "app/firebase/admin.service";
import { OrganizationRepository } from "database/repositorys/Organization";
import { Request } from "express";

import * as admin from "firebase-admin";

@Injectable()
export class MemberService {
  constructor(private readonly firebaseAuthService: FirebaseAuthService) {}

  @Inject() private organizationRepository: OrganizationRepository;
  @Inject(REQUEST) private request: Request;

  async get(params: { organization: string; uid: string }) {
    const organization = await this.organizationRepository._findOne({
      id: params.organization,
    });

    if (
      !organization ||
      !organization.members.includes(this.request.user.uid)
    ) {
      throw new NotFoundException("organization_not_found");
    }

    const user = await this.firebaseAuthService.getUser(params.uid);

    if (!organization.members.includes(user.uid)) {
      throw new UnauthorizedException("not_authorized");
    }

    return user;
  }
}
