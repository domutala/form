import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigDatabase } from "database";
import { AppController } from "./controller";
import { APP_GUARD } from "@nestjs/core";
import { FirebaseAdminModule } from "./firebase/admin.module";
import { FirebaseAuthService } from "./firebase/admin.service";
import { FirebaseAuthGuard } from "./firebase/admin.guard";
import { OrganizationModule } from "./modules/organization/organization.module";
import { ModelModule } from "./modules/model/model.module";
import { MemberModule } from "./modules/member/member.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({ ...ConfigDatabase(), autoLoadEntities: true }),
    FirebaseAdminModule,
    OrganizationModule,
    ModelModule,
    MemberModule,
  ],
  controllers: [AppController],
  providers: [
    FirebaseAuthService,
    { provide: APP_GUARD, useClass: FirebaseAuthGuard },
  ],
})
export class AppModule {}
