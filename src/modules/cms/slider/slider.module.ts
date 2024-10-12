import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from '../../../common/response/response.service';
import { Slider } from './../../../entity/slider.entity';
import { SliderController } from './slider.controller';
import { SliderService } from './slider.service';
import { SliderTranslate } from './../../../entity/slider_translate.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Slider, SliderTranslate])],
    controllers: [SliderController],
    providers: [SliderService, ResponseService],
    exports: [SliderService],
})
export class SliderModule {}
