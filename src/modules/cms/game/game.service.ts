import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import logger from '../../../common/logger';
import { PageBase } from '../../../common/response/response-page-base';
import { plainToClass } from 'class-transformer';
import { CustomRequest } from '../../../interfaces/custom-request.interface';
import { formatSlug, generateSlug } from './../../../utils/toslug.util';
import { Game } from './../../../entity/game.entity';
import { GameTranslate } from './../../../entity/game_translate.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { Platform } from './../../../entity/platform.entity';
import { GameType } from './../../../entity/game_type.entity';
import { UpdateGameDto } from './dto/update-game.dto';
import { ListGameDto } from './dto/list-game.dto';
import { GameHasType } from './../../../entity/game_has_type.entity';
import { GameHasPlatform } from './../../../entity/game_has_platform.entity';

@Injectable({ scope: Scope.REQUEST })
export class GameService {
    constructor(
        @InjectRepository(Game)
        private gameRepository: Repository<Game>,
        @InjectRepository(GameTranslate)
        private gameTranslateRepository: Repository<GameTranslate>,
        @InjectRepository(Platform)
        private platformRepository: Repository<Platform>,
        @InjectRepository(GameType)
        private gameTypeRepository: Repository<GameType>,
        @InjectRepository(GameHasType)
        private gameHasTypeRepository: Repository<GameHasType>,
        @InjectRepository(GameHasPlatform)
        private gameHasPlatformRepository: Repository<GameHasPlatform>,
        @Inject(REQUEST) private readonly request: CustomRequest,
    ) {}

    async findAll(payload: any) {
        try {
            const { pageIndex = 1, pageSize = 20, sort, status, is_hot, name, gameType } = payload;

            const queryBuilder = this.gameRepository
                .createQueryBuilder('game')
                .leftJoinAndSelect('game.gameTranslate', 'gameTranslate')
                .leftJoinAndSelect('game.gameType', 'gameType')
                .leftJoinAndSelect('gameType.gameTypeTranslate', 'gameTypeTranslate')
                .leftJoinAndSelect('game.user', 'user')
                .select([
                    'game.id',
                    'game.thumbnail',
                    'game.vote',
                    'game.rate',
                    'game.status',
                    'game.is_hot',
                    'game.created_at',
                    'game.updated_at',
                    'gameTranslate.name',
                    'gameType.id',
                    'gameTypeTranslate.title',
                    'user.name',
                ]);
            if (sort) {
                queryBuilder.orderBy(`game.${sort.field}`, sort.order.toUpperCase() as 'ASC' | 'DESC');
            } else {
                queryBuilder.orderBy('game.created_at', 'DESC');
            }

            queryBuilder.where('gameTranslate.lang_code = :lang_code', { lang_code: process.env.FALLBACK_LANG });

            queryBuilder.andWhere('gameTypeTranslate.lang_code = :lang_code', { lang_code: process.env.FALLBACK_LANG });

            if (status) queryBuilder.andWhere('game.status = :status', { status });

            if (is_hot) queryBuilder.andWhere('game.is_hot = :is_hot', { is_hot });

            if (name) {
                queryBuilder.andWhere('gameTranslate.name LIKE :name', { name: `%${name}%` });
            }
            if (gameType) {
                queryBuilder.andWhere('gameType.id = :gameType', { gameType: gameType });
            }

            const [entities, totalItems] = await Promise.all([
                queryBuilder
                    .offset((pageIndex - 1) * pageSize)
                    .limit(pageSize)
                    .getMany(),
                queryBuilder.getCount(),
            ]);

            const entitesDto = entities.map((item) => new ListGameDto(item));

            const pageResult = new PageBase(pageIndex, pageSize, totalItems, entitesDto);

            return pageResult;
        } catch (error) {
            logger.error('Lỗi khi lấy danh sách tin tức.');
            logger.error(error.stack);
            return null;
        }
    }

    async findAllSelect() {
        try {
            const queryBuilder = this.gameRepository
                .createQueryBuilder('game')
                .leftJoinAndSelect('game.gameTranslate', 'gameTranslate')
                .select(['game.id', 'game.status', 'gameTranslate.name']);

            queryBuilder.where('gameTranslate.lang_code = :lang_code', { lang_code: process.env.FALLBACK_LANG });

            queryBuilder.andWhere('game.status = :status', { status: 1 });

            const entities = await queryBuilder.getMany();

            const entitesDto = entities.map((item) => ({
                id: item.id,
                name: item.gameTranslate ? item.gameTranslate[0].name : '',
            }));

            return entitesDto;
        } catch (error) {
            logger.error('Lỗi khi lấy danh sách tin tức.');
            logger.error(error.stack);
            return null;
        }
    }

    async findOne(id: number) {
        try {
            const entity = await this.gameRepository.findOne({
                where: { id: Number(id) },
                relations: ['gameTranslate', 'platform', 'gameType'],
            });

            const data = {
                ...entity,
                gameTranslate: entity.gameTranslate
                    ? entity.gameTranslate.reduce((acc, item) => {
                          acc[item.lang_code] = item;
                          return acc;
                      }, {})
                    : '',
                platform: entity.platform ? Array.from(new Set(entity.platform.map((plat) => plat.id))) : [],
                gameType: entity.gameType ? Array.from(new Set(entity.gameType.map((type) => type.id))) : [],
            };

            return data;
        } catch (error) {
            logger.error('Lỗi lấy chi tiết đối tác.');
            logger.error(error.stack);
            return null;
        }
    }

    async findByField(fieldName: string, value: string) {
        try {
            const queryBuilder = this.gameRepository.createQueryBuilder('game');
            queryBuilder.where(`game.${fieldName} = :value`, { value });
            const entity = await queryBuilder.getOne();
            return entity;
        } catch (error) {
            logger.error('Lỗi lấy chi tiết trò chơi.');
            logger.error(error.stack);
            return null;
        }
    }

    async create(createNewDto: CreateGameDto) {
        try {
            const user = this.request.user;

            let slug = '';
            if (createNewDto.slug == '' || createNewDto.slug.trim() == '') {
                slug = generateSlug(createNewDto.VI.name);
            } else {
                slug = formatSlug(createNewDto.slug);
            }

            const platform = await this.platformRepository.find({ where: { id: In(createNewDto.platform) } });

            const gameType = await this.gameTypeRepository.find({ where: { id: In(createNewDto.gameType) } });

            const payloadCreate = plainToClass(Game, {
                gameType: gameType,
                platform: platform,
                slug: slug,
                vote: createNewDto.vote,
                rate: createNewDto.rate,
                thumbnail: createNewDto.thumbnail,
                iframe: createNewDto.iframe,
                status: createNewDto.status,
                is_hot: createNewDto.is_hot,
                created_by: user.userId,
                updated_by: user.userId,
            });

            const savedGame = await this.gameRepository.save(payloadCreate);

            const viTranslation = plainToClass(GameTranslate, {
                ...createNewDto.VI,
                lang_code: 'VI',
            });
            viTranslation.game = savedGame;

            const enTranslation = plainToClass(GameTranslate, {
                ...createNewDto.EN,
                lang_code: 'EN',
            });
            enTranslation.game = savedGame;

            await this.gameTranslateRepository.save([viTranslation, enTranslation]);

            return savedGame;
        } catch (error) {
            logger.error('Lỗi khi tạo mới game.');
            logger.error(error.stack);
            return null;
        }
    }

    async update(id: number, dataDto: UpdateGameDto) {
        try {
            const user = this.request.user;
            const dataDetail = await this.gameRepository.findOne({ where: { id: id }, relations: ['gameTranslate'] });
            if (!dataDetail) {
                logger.error(`Không tìm thấy game với ID ${id}`);
                throw new NotFoundException(`Không tìm thấy game với ID ${id}`);
            }

            let slug = '';
            if (dataDto.slug == '' || (dataDto.slug.trim() == '' && dataDetail.slug == '')) {
                slug = generateSlug(dataDto.EN.name);
            } else {
                slug = formatSlug(dataDto.slug);
            }

            const platform = await this.platformRepository.find({ where: { id: In(dataDto.platform) } });

            const gameType = await this.gameTypeRepository.find({ where: { id: In(dataDto.gameType) } });

            const payloadUpdate = plainToClass(Game, {
                ...dataDetail,
                gameType: gameType,
                platform: platform,
                slug: slug,
                vote: dataDto.vote,
                rate: dataDto.rate,
                thumbnail: dataDto.thumbnail,
                iframe: dataDto.iframe,
                status: dataDto.status,
                is_hot: dataDto.is_hot,
                updated_by: user.userId,
            });

            const savedGame = await this.gameRepository.save(payloadUpdate);

            const viTranslation = dataDetail.gameTranslate.find((translation) => translation.lang_code === 'VI');

            const viTranslationUpdate = plainToClass(GameTranslate, {
                ...viTranslation,
                ...dataDto.VI,
            });

            const enTranslation = dataDetail.gameTranslate.find((translation) => translation.lang_code === 'EN');
            const enTranslationUpdate = plainToClass(GameTranslate, {
                ...enTranslation,
                ...dataDto.EN,
            });

            await this.gameTranslateRepository.save([viTranslationUpdate, enTranslationUpdate]);

            return savedGame;
        } catch (error) {
            if (error.name === 'QueryFailedError' && error.message.includes('invalid input syntax for type uuid')) {
                logger.error(`ID game "${id}" không hợp lệ.`);
            } else {
                logger.error('Lỗi khi cập nhật game.');
                logger.error(error.stack);
            }
            return null;
        }
    }

    async changeIsHot(id: number) {
        try {
            const user = this.request.user;
            const dataDetail = await this.gameRepository.findOne({ where: { id: id } });
            if (!dataDetail) {
                logger.error(`Không tìm thấy game với ID ${id}`);
                throw new NotFoundException(`Không tìm thấy game với ID ${id}`);
            }

            let isHot = 1;

            if (dataDetail.is_hot == 1) {
                isHot = 2;
            }

            const payloadUpdate = plainToClass(Game, {
                ...dataDetail,
                is_hot: isHot,
                updated_by: user.userId,
            });

            const savedGame = await this.gameRepository.save(payloadUpdate);

            return savedGame;
        } catch (error) {
            if (error.name === 'QueryFailedError' && error.message.includes('invalid input syntax for type uuid')) {
                logger.error(`ID game "${id}" không hợp lệ.`);
            } else {
                logger.error('Lỗi khi cập nhật game.');
                logger.error(error.stack);
            }
            return null;
        }
    }

    async delete(data: any) {
        try {
            await this.gameHasPlatformRepository.delete({ game_id: data.id });

            await this.gameHasTypeRepository.delete({ game_id: data.id });

            if (data.gameTranslate.VI) {
                await this.gameTranslateRepository.delete(data.gameTranslate.VI.id);
            }

            if (data.gameTranslate.EN) {
                await this.gameTranslateRepository.delete(data.gameTranslate.EN.id);
            }

            await this.gameRepository.delete(data.id);
        } catch (error) {
            logger.error('Lỗi khi xóa tin tức.');
            logger.error(error.stack);
            return null;
        }
    }
}
