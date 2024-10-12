import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from '../../../common/response/response.service';
import { Platform } from './../../../entity/platform.entity';
import { PlatformController } from './platform.controller';
import { PlatformService } from './platform.service';
import { GameHasPlatform } from '../../../entity/game_has_platform.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Platform, GameHasPlatform])],
    controllers: [PlatformController],
    providers: [PlatformService, ResponseService],
    exports: [PlatformService],
})
export class PlatformModule {}
