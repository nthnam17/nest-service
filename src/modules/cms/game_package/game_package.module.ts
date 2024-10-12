import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from '../../../common/response/response.service';
import { GamePackage } from './../../../entity/game_package.entity';
import { GamePackageTranslate } from './../../../entity/game_package_translate.entity';
import { GamePackageService } from './game_package.service';
import { GamePackageController } from './game_package.controller';

@Module({
    imports: [TypeOrmModule.forFeature([GamePackage, GamePackageTranslate])],
    controllers: [GamePackageController],
    providers: [GamePackageService, ResponseService],
    exports: [GamePackageService],
})
export class GamePackageModule {}
