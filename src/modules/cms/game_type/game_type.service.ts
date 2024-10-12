import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import logger from '../../../common/logger';
import { plainToClass } from 'class-transformer';
import { CustomRequest } from '../../../interfaces/custom-request.interface';
import { GameType } from './../../../entity/game_type.entity';
import { GameTypeTranslate } from './../../../entity/game_type_translate.entity';
import { ListGameTypeDto } from './dto/list-game_type.dto';
import { CreateGameTypeDto } from './dto/create-game_type.dto';
import { generateSlug } from './../../../utils/toslug.util';
import { UpdateGameTypeDto } from './dto/update-game_type.dto';
import { GameHasType } from './../../../entity/game_has_type.entity';

@Injectable({ scope: Scope.REQUEST })
export class GameTypeService {
    constructor(
        @InjectRepository(GameType)
        private gameTypeRepository: Repository<GameType>,
        @InjectRepository(GameTypeTranslate)
        private gameTypeTranslateRepository: Repository<GameTypeTranslate>,
        @InjectRepository(GameHasType)
        private gameHasTypeRepository: Repository<GameHasType>,
        @Inject(REQUEST) private readonly request: CustomRequest,
    ) {}

    async findAll() {
        try {
            const queryBuilder = this.gameTypeRepository
                .createQueryBuilder('game_type')
                .leftJoinAndSelect('game_type.gameTypeTranslate', 'gameTypeTranslate')
                .select([
                    'game_type.id',
                    'game_type.slug',
                    'game_type.created_at',
                    'game_type.updated_at',
                    'gameTypeTranslate.title',
                ])
                .orderBy('game_type.created_at', 'DESC');

            queryBuilder.where('gameTypeTranslate.lang_code = :lang_code', { lang_code: process.env.FALLBACK_LANG });

            const entities = await queryBuilder.getMany();

            const entitesDto = entities.map((item) => new ListGameTypeDto(item));

            return entitesDto;
        } catch (error) {
            logger.error('Lỗi khi lấy danh sách thể loại trò chơi.');
            logger.error(error.stack);
            return null;
        }
    }

    async findSelect() {
        try {
            const queryBuilder = this.gameTypeRepository
                .createQueryBuilder('game_type')
                .leftJoinAndSelect('game_type.gameTypeTranslate', 'gameTypeTranslate')
                .select(['game_type.id', 'game_type.slug', 'gameTypeTranslate.title'])
                .orderBy('game_type.created_at', 'DESC');

            queryBuilder.where('gameTypeTranslate.lang_code = :lang_code', { lang_code: process.env.FALLBACK_LANG });

            const entities = await queryBuilder.getMany();

            const data = entities.map((item) => ({
                id: item.id,
                slug: item.slug,
                title: item.gameTypeTranslate ? item.gameTypeTranslate[0].title : '',
            }));

            return data;
        } catch (error) {
            logger.error('Lỗi khi lấy danh sách thể loại trò chơi.');
            logger.error(error.stack);
            return null;
        }
    }

    async findOne(id: number) {
        try {
            const entity = await this.gameTypeRepository.findOne({
                where: { id: Number(id) },
                relations: ['gameTypeTranslate'],
            });

            const data = {
                ...entity,
                gameTypeTranslate: entity.gameTypeTranslate.reduce((acc, item) => {
                    acc[item.lang_code] = item;
                    return acc;
                }, {}),
            };

            return data;
        } catch (error) {
            logger.error('Lỗi lấy chi tiết thể loại game.');
            logger.error(error.stack);
            return null;
        }
    }

    async findByField(fieldName: string, value: string) {
        try {
            const queryBuilder = this.gameTypeRepository.createQueryBuilder('game_type');
            queryBuilder.where(`game_type.${fieldName} = :value`, { value });
            const entity = await queryBuilder.getOne();
            return entity;
        } catch (error) {
            logger.error('Lỗi lấy chi tiết thể loại trò chơi.');
            logger.error(error.stack);
            return null;
        }
    }

    async create(createNewDto: CreateGameTypeDto) {
        try {
            const user = this.request.user;
            const gameType = new GameType();
            let slug = '';

            if (createNewDto.slug == '' || createNewDto.slug.trim() == '') {
                slug = generateSlug(createNewDto.EN.title);
            } else {
                slug = createNewDto.slug;
            }

            gameType.slug = slug;
            gameType.created_by = user.userId;
            gameType.updated_by = user.userId;

            const savedGameType = await this.gameTypeRepository.save(gameType);

            const viTranslation = plainToClass(GameTypeTranslate, {
                ...createNewDto.VI,
                lang_code: 'VI',
            });

            viTranslation.gameType = savedGameType;

            const enTranslation = plainToClass(GameTypeTranslate, {
                ...createNewDto.EN,
                lang_code: 'EN',
            });

            enTranslation.gameType = savedGameType;

            await this.gameTypeTranslateRepository.save([viTranslation, enTranslation]);

            return savedGameType;
        } catch (error) {
            logger.error('Lỗi khi tạo mới thể loại trò chơi.');
            logger.error(error.stack);
            return null;
        }
    }

    async update(id: number, dataDto: UpdateGameTypeDto) {
        try {
            const dataDetail = await this.gameTypeRepository.findOne({
                where: { id: id },
                relations: ['gameTypeTranslate'],
            });
            if (!dataDetail) {
                logger.error(`Không tìm thấy thể loại trò chơi với ID ${id}`);
                throw new NotFoundException(`Không tìm thấy thể loại trò chơi với ID ${id}`);
            }

            const user = this.request.user;
            const gameTypeUpdate = plainToClass(GameType, {
                ...dataDetail,
                slug: dataDto.slug !== '' ? dataDto.slug : dataDto.slug,
                updated_by: user.userId,
            });

            const savedNews = await this.gameTypeRepository.save(gameTypeUpdate);

            const viTranslation = dataDetail.gameTypeTranslate.find((translation) => translation.lang_code === 'VI');

            const viTranslationUpdate = plainToClass(GameTypeTranslate, {
                ...viTranslation,
                ...dataDto.VI,
            });

            const enTranslation = dataDetail.gameTypeTranslate.find((translation) => translation.lang_code === 'EN');
            const enTranslationUpdate = plainToClass(GameTypeTranslate, {
                ...enTranslation,
                ...dataDto.EN,
            });

            await this.gameTypeTranslateRepository.save([viTranslationUpdate, enTranslationUpdate]);

            return savedNews;
        } catch (error) {
            if (error.name === 'QueryFailedError' && error.message.includes('invalid input syntax for type uuid')) {
                logger.error(`ID thể loại trò chơi "${id}" không hợp lệ.`);
            } else {
                logger.error('Lỗi khi cập nhật thể loại trò chơi.');
                logger.error(error.stack);
            }
            return null;
        }
    }

    async delete(data: any) {
        try {
            const countGameTypeUsed = await this.gameHasTypeRepository
                .createQueryBuilder('game_has_type')
                .where('game_has_type.game_type_id = :game_type_id', { game_type_id: data.id })
                .getCount();
            if (countGameTypeUsed == 0) {
                await this.gameTypeRepository.delete(data.id);
                await this.gameTypeTranslateRepository.delete(data.gameTypeTranslate.VI.id);
                await this.gameTypeTranslateRepository.delete(data.gameTypeTranslate.EN.id);
            }
        } catch (error) {
            logger.error('Lỗi khi xóa thể loại trò chơi.');
            logger.error(error.stack);
            return null;
        }
    }
}
