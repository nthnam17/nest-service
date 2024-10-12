import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import logger from '../../../common/logger';
import { PageBase } from '../../../common/response/response-page-base';
import { plainToClass } from 'class-transformer';
import { CustomRequest } from '../../../interfaces/custom-request.interface';
import { News } from './../../../entity/news.entity';
import { GalaxyTranslate } from './../../../entity/galaxy_translate.entity';
import { Galaxy } from './../../../entity/galaxy.entity';
import { ListGalaxyDto } from './dto/list-galaxy.dto';
import { CreateGalaxyDto } from './dto/create-galaxy.dto';
import { UpdateGalaxyDto } from './dto/update-galaxy.dto';

@Injectable({ scope: Scope.REQUEST })
export class GalaxyService {
    constructor(
        @InjectRepository(Galaxy)
        private galaxyRepository: Repository<Galaxy>,
        @InjectRepository(GalaxyTranslate)
        private galaxyTranslateRepository: Repository<GalaxyTranslate>,
        @Inject(REQUEST) private readonly request: CustomRequest,
    ) {}

    async findAll(homePageId: number) {
        try {
            const queryBuilder = this.galaxyRepository
                .createQueryBuilder('galaxy')
                .leftJoinAndSelect('galaxy.galaxyTranslate', 'galaxyTranslate')
                .select([
                    'galaxy.id',
                    'galaxy.image',
                    'galaxy.created_at',
                    'galaxy.updated_at',
                    'galaxyTranslate.title',
                    'galaxyTranslate.description',
                ]);

            queryBuilder.orderBy('galaxy.id', 'DESC');

            queryBuilder.where('galaxyTranslate.lang_code = :lang_code', { lang_code: process.env.FALLBACK_LANG });

            queryBuilder.andWhere('galaxy.homePageId = :homePageId', { homePageId: homePageId });

            const entities = await queryBuilder.getMany();

            const entitesDto = entities.map((item) => new ListGalaxyDto(item));

            return entitesDto;
        } catch (error) {
            logger.error('Lỗi khi lấy danh sách vũ trụ.');
            logger.error(error.stack);
            return null;
        }
    }

    async findAllByHomePage(homePageId: number) {
        try {
            const queryBuilder = this.galaxyRepository
                .createQueryBuilder('galaxy')
                .leftJoinAndSelect('galaxy.galaxyTranslate', 'galaxyTranslate')
                .select([
                    'galaxy.id',
                    'galaxy.image',
                    'galaxy.created_at',
                    'galaxy.updated_at',
                    'galaxyTranslate.title',
                    'galaxyTranslate.description',
                ]);

            queryBuilder.orderBy(`galaxy.created_at`, 'DESC');

            queryBuilder
                .where('galaxyTranslate.lang_code = :lang_code', {
                    lang_code: process.env.FALLBACK_LANG,
                })
                .andWhere('galaxy.homePageId = :homePageId', { homePageId: homePageId });

            const entities = await queryBuilder.getMany();

            const entitesDto = entities.map((item) => new ListGalaxyDto(item));

            return entitesDto;
        } catch (error) {
            logger.error('Lỗi khi lấy danh sách thông tin.');
            logger.error(error.stack);
            return null;
        }
    }

    async findOne(id: number) {
        try {
            const entity = await this.galaxyRepository.findOne({
                where: { id: Number(id) },
                relations: ['galaxyTranslate'],
            });

            const data = {
                ...entity,
                galaxyTranslate: entity.galaxyTranslate.reduce((acc, item) => {
                    acc[item.lang_code] = item;
                    return acc;
                }, {}),
            };

            return data;
        } catch (error) {
            logger.error('Lỗi lấy chi tiết vũ trụ.');
            logger.error(error.stack);
            return null;
        }
    }

    async findByField(fieldName: string, value: string) {
        try {
            const queryBuilder = this.galaxyRepository.createQueryBuilder('galaxy');
            queryBuilder.where(`galaxy.${fieldName} = :value`, { value });
            const entity = await queryBuilder.getOne();
            return entity;
        } catch (error) {
            logger.error('Lỗi lấy chi tiết.');
            logger.error(error.stack);
            return null;
        }
    }

    async create(createNewDto: CreateGalaxyDto) {
        try {
            const user = this.request.user;
            const galaxy = new Galaxy();
            galaxy.image = createNewDto.image;
            galaxy.homePageId = createNewDto.homePageId;
            galaxy.created_by = user.userId;
            galaxy.updated_by = user.userId;

            const savedGalaxy = await this.galaxyRepository.save(galaxy);

            const viTranslation = new GalaxyTranslate();
            Object.assign(viTranslation, {
                ...createNewDto.VI,
                lang_code: 'VI',
            });
            viTranslation.galaxy = savedGalaxy;

            const enTranslation = new GalaxyTranslate();
            Object.assign(enTranslation, {
                ...createNewDto.EN,
                lang_code: 'EN',
            });
            enTranslation.galaxy = savedGalaxy;

            await this.galaxyTranslateRepository.save([viTranslation, enTranslation]);

            return savedGalaxy;
        } catch (error) {
            logger.error('Lỗi khi tạo mới thông tin.');
            logger.error(error.stack);
            return null;
        }
    }

    async update(id: number, dataDto: UpdateGalaxyDto) {
        try {
            const dataDetail = await this.galaxyRepository.findOne({
                where: { id: id },
                relations: ['galaxyTranslate'],
            });
            if (!dataDetail) {
                logger.error(`Không tìm thấy thông tin với ID ${id}`);
                throw new NotFoundException(`Không tìm thấy thông tin với ID ${id}`);
            }

            const user = this.request.user;
            Object.assign(dataDetail, {
                image: dataDto.image,
                homePageId: dataDto.homePageId,
                updated_by: user.userId,
            });

            const savedNews = await this.galaxyRepository.save(dataDetail);

            const viTranslation = dataDetail.galaxyTranslate.find((translation) => translation.lang_code === 'VI');

            const viTranslationUpdate = plainToClass(GalaxyTranslate, {
                ...viTranslation,
                ...dataDto.VI,
            });

            const enTranslation = dataDetail.galaxyTranslate.find((translation) => translation.lang_code === 'EN');
            const enTranslationUpdate = plainToClass(GalaxyTranslate, {
                ...enTranslation,
                ...dataDto.EN,
            });

            await this.galaxyTranslateRepository.save([viTranslationUpdate, enTranslationUpdate]);

            return savedNews;
        } catch (error) {
            if (error.name === 'QueryFailedError' && error.message.includes('invalid input syntax for type uuid')) {
                logger.error(`ID quyền "${id}" không hợp lệ.`);
            } else {
                logger.error('Lỗi khi cập nhật thông tin');
                logger.error(error.stack);
            }
            return null;
        }
    }

    async delete(data: any) {
        try {
            await this.galaxyTranslateRepository.delete(data.galaxyTranslate.VI.id);
            await this.galaxyTranslateRepository.delete(data.galaxyTranslate.EN.id);
            await this.galaxyRepository.delete(data.id);
        } catch (error) {
            logger.error('Lỗi khi xóa thông tin');
            logger.error(error.stack);
            return null;
        }
    }
}
