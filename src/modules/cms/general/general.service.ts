import { Platform } from './../../../entity/platform.entity';
import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import logger from '../../../common/logger';
import { plainToClass } from 'class-transformer';
import { CustomRequest } from '../../../interfaces/custom-request.interface';
import { Partner } from '../../../entity/partner.entity';
import { General } from '../../../entity/general.entity';
import { GeneralTranslate } from '../../../entity/general_translate.entity';
import { UpdateGeneralDto } from './dto/update-one-general.dto';

@Injectable({ scope: Scope.REQUEST })
export class GeneralService {
    constructor(
        @InjectRepository(General)
        private generalRepository: Repository<General>,
        @InjectRepository(GeneralTranslate)
        private generalTranslateRepository: Repository<GeneralTranslate>,
        @Inject(REQUEST) private readonly request: CustomRequest,
    ) {}

    async findGeneral() {
        try {
            const entity = await this.generalRepository
                .createQueryBuilder('general')
                .leftJoinAndSelect('general.generalTranslate', 'generalTranslate')
                .getOne();
            const entityData = {
                ...entity,
                generalTranslate: entity.generalTranslate.reduce((acc, item) => {
                    acc[item.lang_code] = item;
                    return acc;
                }, {}),
            };
            return entityData;
        } catch (error) {
            logger.error('Lỗi lấy chi tiết nền tảng.');
            logger.error(error.stack);
            return null;
        }
    }

    async update(id: number, dataDto: UpdateGeneralDto) {
        try {
            const user = this.request.user;
            const dataDetail = await this.generalRepository.findOne({
                where: { id: id },
                relations: ['generalTranslate'],
            });
            if (!dataDetail) {
                logger.error(`Không tìm thấy cấu hình hệ thống với ID ${id}`);
                throw new NotFoundException(`Không tìm thấy cấu hình hệ thống với ID ${id}`);
            }

            const updated = plainToClass(Partner, {
                ...dataDetail,
                favicon: dataDto.favicon,
                logo: dataDto.logo,
                email: dataDto.email,
                phone: dataDto.phone,
                link: dataDto.link,
                map: dataDto.map,
                add_header: dataDto.add_header,
                add_body: dataDto.add_body,
                src_analytics: dataDto.src_analytics,
                inner_analytics: dataDto.inner_analytics,
                business_license: dataDto.business_license,
                updated_by: user.userId,
            });

            const saveGeneral = await this.generalRepository.save(updated);

            const dataGeneralVI = saveGeneral.generalTranslate.find((translation) => translation.lang_code === 'VI');
            const viTranslation = plainToClass(GeneralTranslate, {
                ...dataGeneralVI,
                ...dataDto.VI,
            });

            const dataGeneralEN = saveGeneral.generalTranslate.find((translation) => translation.lang_code === 'EN');
            const enTranslation = plainToClass(GeneralTranslate, {
                ...dataGeneralEN,
                ...dataDto.EN,
            });

            await this.generalTranslateRepository.save([viTranslation, enTranslation]);

            return saveGeneral;
        } catch (error) {
            if (error.name === 'QueryFailedError' && error.message.includes('invalid input syntax for type uuid')) {
                logger.error(`ID cấu hình "${id}" không hợp lệ.`);
            } else {
                logger.error('Lỗi khi cập nhật cấu hình.');
                logger.error(error.stack);
            }
            return null;
        }
    }
}
