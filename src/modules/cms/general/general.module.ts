import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from '../../../common/response/response.service';
import { GeneralService } from './general.service';
import { GeneralController } from './general.controller';
import { General } from '../../../entity/general.entity';
import { GeneralTranslate } from '../../../entity/general_translate.entity';

@Module({
    imports: [TypeOrmModule.forFeature([General, GeneralTranslate])],
    controllers: [GeneralController],
    providers: [GeneralService, ResponseService],
    exports: [GeneralService],
})
export class GeneralModule {}
