import { Controller, Get, Inject, Body, Post, Param } from "@nestjs/common";
import { OrganizationService } from "./organization.service";

@Controller("organization")
export class ModelController {
  constructor() {}

  @Inject() private readonly service: OrganizationService;

  @Post("/create")
  async create(@Body() body: any) {
    return await this.service.create(body);
  }

  @Post("remove/:id")
  async remove(@Param("id") id: any) {
    return await this.service.remove({ id });
  }

  @Get("/")
  async list() {
    return await this.service.list();
  }
}
