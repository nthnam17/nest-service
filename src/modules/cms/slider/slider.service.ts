import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import logger from '../../../common/logger';
import { PageBase } from '../../../common/response/response-page-base';
import { plainToClass } from 'class-transformer';
import { CustomRequest } from '../../../interfaces/custom-request.interface';
import { ListSliderDto } from './dto/list.dto';
import { Slider } from './../../../entity/slider.entity';
import { CreateSliderDto } from './dto/create-new.dto';
import { SliderTranslate } from './../../../entity/slider_translate.entity';
import { UpdateSliderDto } from './dto/update.dto';
import { generateSlug } from './../../../utils/toslug.util';

@Injectable({ scope: Scope.REQUEST })
export class SliderService {
    constructor(
        @InjectRepository(Slider)
        private sliderRepository: Repository<Slider>,
        @InjectRepository(SliderTranslate)
        private sliderTranslateRepository: Repository<SliderTranslate>,
        @Inject(REQUEST) private readonly request: CustomRequest,
    ) {}

    async findAll(payload: any) {
        try {
            const { title, status, pageIndex = 1, pageSize = 20, sort } = payload;

            const queryBuilder = this.sliderRepository
                .createQueryBuilder('slider')
                .leftJoinAndSelect('slider.sliderTranslate', 'sliderTranslate')
                .select([
                    'slider.id',
                    'slider.slug',
                    'slider.image',
                    'slider.position',
                    'slider.status',
                    'sliderTranslate.title',
                ])
                .where('sliderTranslate.lang_code = :lang_code', { lang_code: process.env.FALLBACK_LANG });

            if (sort) {
                queryBuilder.orderBy(`slider.${sort.field}`, sort.order.toUpperCase() as 'ASC' | 'DESC');
            } else {
                queryBuilder.orderBy(`slider.position`, 'ASC');
            }

            if (title) queryBuilder.andWhere('sliderTranslate.title LIKE :title', { title: `%${title}%` });

            if (status) queryBuilder.andWhere('slider.status = :status', { status: status });

            const entities = await queryBuilder.getMany();

            const slider = entities.map((cate) => new ListSliderDto(cate));

            const pageResult = new PageBase(pageIndex, pageSize, slider.length, slider);
            return pageResult;
        } catch (error) {
            logger.error('Lỗi khi lấy danh sách slider.');
            logger.error(error.stack);
            return null;
        }
    }

    async findOne(id: number) {
        try {
            const entity = await this.sliderRepository.findOne({ where: { id }, relations: ['sliderTranslate'] });
            const data = {
                ...entity,
                sliderTranslate: entity.sliderTranslate.reduce((acc, item) => {
                    acc[item.lang_code] = item;
                    return acc;
                }, {}),
            };

            return data;
        } catch (error) {
            logger.error('Lỗi lấy chi tiết slider.');
            logger.error(error.stack);
            return null;
        }
    }

    async findByField(fieldName: string, value: string) {
        try {
            const queryBuilder = this.sliderRepository.createQueryBuilder('slider');
            queryBuilder.where(`slider.${fieldName} = :value`, { value });
            const entity = await queryBuilder.getOne();

            return entity;
        } catch (error) {
            logger.error('Lỗi lấy chi tiết slider.');
            logger.error(error.stack);
            return null;
        }
    }

    async create(createNewDto: CreateSliderDto) {
        try {
            const currentUser = this.request.user;

            const sliderCreate = plainToClass(Slider, {
                slug: createNewDto.slug !== '' ? createNewDto.slug : generateSlug(createNewDto.EN.title),
                status: createNewDto.status,
                image: createNewDto.image,
                position: createNewDto.position,
                created_by: currentUser?.userId,
                updated_by: currentUser?.userId,
            });

            const savedSlider = await this.sliderRepository.save(sliderCreate);

            const viTranslation = plainToClass(SliderTranslate, {
                ...createNewDto.VI,
                lang_code: 'VI',
            });

            viTranslation.slider = savedSlider;

            const enTranslation = plainToClass(SliderTranslate, {
                ...createNewDto.EN,
                lang_code: 'EN',
            });

            enTranslation.slider = savedSlider;

            await this.sliderTranslateRepository.save([viTranslation, enTranslation]);

            return savedSlider;
        } catch (error) {
            logger.error('Lỗi khi tạo mới slider.');
            logger.error(error.stack);
            return null;
        }
    }

    async update(id: number, updateOneDto: UpdateSliderDto) {
        try {
            const dataOne = await this.sliderRepository.findOne({ where: { id }, relations: ['sliderTranslate'] });
            if (!dataOne) {
                logger.error(`Không tìm thấy slider với ID ${id}`);
                throw new NotFoundException(`Không tìm thấy slider với ID ${id}`);
            }

            const currentUser = this.request.user;
            const updatedOne = plainToClass(Slider, {
                ...dataOne,
                slug: updateOneDto.slug ? updateOneDto.slug : dataOne.slug,
                status: updateOneDto.status,
                image: updateOneDto.image,
                position: updateOneDto.position,
                updated_by: currentUser?.userId,
            });
            const dataSaved = await this.sliderRepository.save(updatedOne);

            const viTranslationData = dataOne.sliderTranslate.find((translation) => translation.lang_code === 'VI');
            const viTranslation = plainToClass(SliderTranslate, {
                ...viTranslationData,
                ...updateOneDto.VI,
            });

            const enTranslationData = dataOne.sliderTranslate.find((translation) => translation.lang_code === 'EN');
            const enTranslation = plainToClass(SliderTranslate, {
                ...enTranslationData,
                ...updateOneDto.EN,
            });

            await this.sliderTranslateRepository.save([enTranslation, viTranslation]);

            return dataSaved;
        } catch (error) {
            if (error.name === 'QueryFailedError' && error.message.includes('invalid input syntax for type uuid')) {
                logger.error(`ID slider "${id}" không hợp lệ.`);
            } else {
                logger.error('Lỗi khi cập nhật slider.');
                logger.error(error.stack);
            }
            return null;
        }
    }

    async delete(data: any) {
        try {
            await this.sliderTranslateRepository.delete(data.sliderTranslate.VI.id);
            await this.sliderTranslateRepository.delete(data.sliderTranslate.EN.id);
            await this.sliderRepository.delete(data.id);
        } catch (error) {
            logger.error('Lỗi khi xóa slider.');
            logger.error(error.stack);
            return null;
        }
    }
}
