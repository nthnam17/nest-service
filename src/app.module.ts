import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/cms/users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { PermissionModule } from './modules/cms/permissions/permission.module';
import { RoleModule } from './modules/cms/role/role.module';
import { RoleHasPermissionModule } from './modules/cms/role_has_permission/role_has_permission.module';
import { SliderModule } from './modules/cms/slider/slider.module';
import { PartnerModule } from './modules/cms/partner/partner.module';
import { GalaxyModule } from './modules/cms/galaxy/galaxy.module';
import { ContactModule } from './modules/cms/contact/contact.module';
import { GamePackageModule } from './modules/cms/game_package/game_package.module';
import { GameTypeModule } from './modules/cms/game_type/game_type.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { PlatformModule } from './modules/cms/platform/platform.module';
import { GameModule } from './modules/cms/game/game.module';
import { CustomerModule } from './modules/cms/customer/customer.module';
import { CaseStudyModule } from './modules/cms/case_study/case_study.module';
import { GeneralModule } from './modules/cms/general/general.module';
@Module({
    imports: [
        ConfigModule.forRoot(),
        UsersModule,
        AuthModule,
        PermissionModule,
        RoleModule,
        RoleHasPermissionModule,
        SliderModule,
        PartnerModule,
        GalaxyModule,
        ContactModule,
        GamePackageModule,
        GameTypeModule,
        PlatformModule,
        GameModule,
        CustomerModule,
        CaseStudyModule,
        GeneralModule,

        TypeOrmModule.forRoot({
            type: process.env.TYPE as any,
            host: process.env.MYSQL_HOST,
            port: parseInt(process.env.MYSQL_PORT),
            username: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DB,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: false,
            timezone: 'Asia/Ho_Chi_Minh',
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const expiresIn = configService.get<string>('JWT_EXPIRES_IN');
                return {
                    secret: configService.get<string>('JWT_SECRET'),
                    signOptions: { expiresIn },
                };
            },
            inject: [ConfigService],
        }),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        JwtService,
        Reflector,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {
    constructor() {}
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
