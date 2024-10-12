import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from '../../../common/response/response.service';
import { GalaxyService } from './galaxy.service';
import { GalaxyController } from './galaxy.controller';
import { GalaxyTranslate } from './../../../entity/galaxy_translate.entity';
import { Galaxy } from './../../../entity/galaxy.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Galaxy, GalaxyTranslate])],
    controllers: [GalaxyController],
    providers: [GalaxyService, ResponseService],
    exports: [GalaxyService],
})
export class GalaxyModule {}
