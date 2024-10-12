import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from '../../../common/response/response.service';
import { GameType } from './../../../entity/game_type.entity';
import { GameTypeTranslate } from './../../../entity/game_type_translate.entity';
import { GameTypeController } from './game_type.controller';
import { GameTypeService } from './game_type.service';
import { GameHasType } from './../../../entity/game_has_type.entity';

@Module({
    imports: [TypeOrmModule.forFeature([GameType, GameTypeTranslate, GameHasType])],
    controllers: [GameTypeController],
    providers: [GameTypeService, ResponseService],
    exports: [GameTypeService],
})
export class GameTypeModule {}
