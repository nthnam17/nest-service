import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from '../../../common/response/response.service';
import { GalaxyTranslate } from './../../../entity/galaxy_translate.entity';
import { Galaxy } from './../../../entity/galaxy.entity';
import { CaseStudyService } from './case_study.service';
import { CaseStudyController } from './case_study.controller';
import { CaseStudy } from './../../../entity/case_study.entity';
import { CaseStudyTranslate } from './../../../entity/case_study_translate.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CaseStudy, CaseStudyTranslate])],
    controllers: [CaseStudyController],
    providers: [CaseStudyService, ResponseService],
    exports: [CaseStudyService],
})
export class CaseStudyModule {}
