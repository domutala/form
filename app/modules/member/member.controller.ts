import { Controller, Get, Inject, Body, Post, Param } from "@nestjs/common";
import { MemberService } from "./member.service";

@Controller("member/:organization")
export class MemberController {
  constructor() {}

  @Inject() private readonly service: MemberService;

  @Get("/:uid")
  async getUser(
    @Param("organization") organization: string,
    @Param("uid") uid: string,
  ) {
    return await this.service.get({ organization, uid });
  }
}
