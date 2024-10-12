import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from '../../../common/response/response.service';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { Game } from './../../../entity/game.entity';
import { GameTranslate } from './../../../entity/game_translate.entity';
import { Platform } from './../../../entity/platform.entity';
import { GameType } from './../../../entity/game_type.entity';
import { GameHasType } from './../../../entity/game_has_type.entity';
import { GameHasPlatform } from './../../../entity/game_has_platform.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Game, GameTranslate, Platform, GameType, GameHasType, GameHasPlatform])],
    controllers: [GameController],
    providers: [GameService, ResponseService],
    exports: [GameService],
})
export class GameModule {}
