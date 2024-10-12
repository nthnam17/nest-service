import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import logger from '../../../common/logger';
import { plainToClass } from 'class-transformer';
import { CustomRequest } from '../../../interfaces/custom-request.interface';
import { GamePackage } from './../../../entity/game_package.entity';
import { GamePackageTranslate } from './../../../entity/game_package_translate.entity';
import { ListGamePackageDto } from './dto/list-game_package.dto';
import { CreateGamePackageDto } from './dto/create-game_package.dto';
import { UpdatedGamePackageDto } from './dto/update-game_package.dto';
import { emit } from 'process';
import { FilterGamePackageDto } from './dto/filter-game_package.dto';

@Injectable({ scope: Scope.REQUEST })
export class GamePackageService {
    constructor(
        @InjectRepository(GamePackage)
        private gamePackageRepository: Repository<GamePackage>,
        @InjectRepository(GamePackageTranslate)
        private gamePackageTranslateRepository: Repository<GamePackageTranslate>,
        @Inject(REQUEST) private readonly request: CustomRequest,
    ) {}

    async findAll(params: FilterGamePackageDto) {
        try {
            const { status, is_hot, name } = params;

            const queryBuilder = this.gamePackageRepository
                .createQueryBuilder('game_package')
                .leftJoinAndSelect('game_package.gamePackageTranslate', 'gamePackageTranslate')
                .select([
                    'game_package.id',
                    'game_package.image',
                    'game_package.price',
                    'game_package.status',
                    'game_package.is_hot',
                    'game_package.created_at',
                    'game_package.updated_at',
                    'gamePackageTranslate.title',
                    'gamePackageTranslate.description',
                ])
                .orderBy('game_package.created_at', 'DESC');

            queryBuilder.where('gamePackageTranslate.lang_code = :lang_code', { lang_code: process.env.FALLBACK_LANG });

            if (status) queryBuilder.andWhere('game_package.status = :status', { status: status });

            if (is_hot) queryBuilder.andWhere('game_package.is_hot = :is_hot', { is_hot: is_hot });

            if (name) {
                queryBuilder.andWhere('gamePackageTranslate.title LIKE :title', { title: `%${name}%` });
            }

            const entities = await queryBuilder.getMany();

            const entitesDto = entities.map((item) => new ListGamePackageDto(item));

            return entitesDto;
        } catch (error) {
            logger.error('Lỗi khi lấy danh sách gói trò chơi.');
            logger.error(error.stack);
            return null;
        }
    }

    async findOne(id: number) {
        try {
            const entity = await this.gamePackageRepository.findOne({
                where: { id: Number(id) },
                relations: ['gamePackageTranslate'],
            });

            const data = {
                ...entity,
                gamePackageTranslate: entity.gamePackageTranslate.reduce((acc, item) => {
                    acc[item.lang_code] = item;
                    return acc;
                }, {}),
            };

            return data;
        } catch (error) {
            logger.error('Lỗi lấy chi tiết gói game.');
            logger.error(error.stack);
            return null;
        }
    }

    async findByField(fieldName: string, value: string) {
        try {
            const queryBuilder = this.gamePackageRepository.createQueryBuilder('news');
            queryBuilder.where(`news.${fieldName} = :value`, { value });
            const entity = await queryBuilder.getOne();
            return entity;
        } catch (error) {
            logger.error('Lỗi lấy chi tiết tin tức.');
            logger.error(error.stack);
            return null;
        }
    }

    async create(createNewDto: CreateGamePackageDto) {
        try {
            const user = this.request.user;
            const gamePackage = new GamePackage();

            gamePackage.price = createNewDto.price;
            gamePackage.created_by = user.userId;
            gamePackage.updated_by = user.userId;
            gamePackage.image = createNewDto.image;
            gamePackage.status = createNewDto.status;
            gamePackage.is_hot = createNewDto.is_hot;

            const savedGamePackage = await this.gamePackageRepository.save(gamePackage);

            const viTranslation = plainToClass(GamePackageTranslate, {
                ...createNewDto.VI,
                lang_code: 'VI',
            });

            viTranslation.gamePackage = savedGamePackage;

            const enTranslation = plainToClass(GamePackageTranslate, {
                ...createNewDto.EN,
                lang_code: 'EN',
            });

            enTranslation.gamePackage = savedGamePackage;

            await this.gamePackageTranslateRepository.save([viTranslation, enTranslation]);

            return savedGamePackage;
        } catch (error) {
            logger.error('Lỗi khi tạo mới gói trò chơi.');
            logger.error(error.stack);
            return null;
        }
    }

    async update(id: number, dataDto: UpdatedGamePackageDto) {
        try {
            const dataDetail = await this.gamePackageRepository.findOne({
                where: { id: id },
                relations: ['gamePackageTranslate'],
            });
            if (!dataDetail) {
                logger.error(`Không tìm thấy gói trò chơi với ID ${id}`);
                throw new NotFoundException(`Không tìm thấy gói trò chơi với ID ${id}`);
            }

            const user = this.request.user;
            const gamePackageUpdate = plainToClass(GamePackage, {
                ...dataDetail,
                image: dataDto.image,
                price: dataDto.price,
                updated_by: user.userId,
                status: dataDto.status,
                is_hot: dataDto.is_hot,
            });

            const savedNews = await this.gamePackageRepository.save(gamePackageUpdate);

            const viTranslation = dataDetail.gamePackageTranslate.find((translation) => translation.lang_code === 'VI');

            const viTranslationUpdate = plainToClass(GamePackageTranslate, {
                ...viTranslation,
                ...dataDto.VI,
            });

            const enTranslation = dataDetail.gamePackageTranslate.find((translation) => translation.lang_code === 'EN');
            const enTranslationUpdate = plainToClass(GamePackageTranslate, {
                ...enTranslation,
                ...dataDto.EN,
            });

            await this.gamePackageTranslateRepository.save([viTranslationUpdate, enTranslationUpdate]);

            return savedNews;
        } catch (error) {
            if (error.name === 'QueryFailedError' && error.message.includes('invalid input syntax for type uuid')) {
                logger.error(`ID gói trò chơi "${id}" không hợp lệ.`);
            } else {
                logger.error('Lỗi khi cập nhật gói trò chơi.');
                logger.error(error.stack);
            }
            return null;
        }
    }

    async changeIsHot(id: number) {
        try {
            const dataDetail = await this.gamePackageRepository.findOne({
                where: { id: id },
            });
            if (!dataDetail) {
                logger.error(`Không tìm thấy gói trò chơi với ID ${id}`);
                throw new NotFoundException(`Không tìm thấy gói trò chơi với ID ${id}`);
            }

            const user = this.request.user;
            let gamePackageUpdate: any = {};
            if (dataDetail.is_hot == 1) {
                gamePackageUpdate = plainToClass(GamePackage, {
                    ...dataDetail,
                    is_hot: 2,
                    updated_by: user.userId,
                });
            } else {
                gamePackageUpdate = plainToClass(GamePackage, {
                    ...dataDetail,
                    is_hot: 1,
                    updated_by: user.userId,
                });
            }

            const savedNews = await this.gamePackageRepository.save(gamePackageUpdate);

            return savedNews;
        } catch (error) {
            if (error.name === 'QueryFailedError' && error.message.includes('invalid input syntax for type uuid')) {
                logger.error(`ID gói trò chơi "${id}" không hợp lệ.`);
            } else {
                logger.error('Lỗi khi cập nhật gói trò chơi.');
                logger.error(error.stack);
            }
            return null;
        }
    }

    async delete(data: any) {
        try {
            await this.gamePackageTranslateRepository.delete(data.gamePackageTranslate.VI.id);
            await this.gamePackageTranslateRepository.delete(data.gamePackageTranslate.EN.id);
            await this.gamePackageRepository.delete(data.id);
        } catch (error) {
            logger.error('Lỗi khi xóa gói trò chơi.');
            logger.error(error.stack);
            return null;
        }
    }
}
