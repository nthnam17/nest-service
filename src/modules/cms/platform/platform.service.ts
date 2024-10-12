import { Platform } from './../../../entity/platform.entity';
import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import logger from '../../../common/logger';
import { PageBase } from '../../../common/response/response-page-base';
import { plainToClass } from 'class-transformer';
import { CustomRequest } from '../../../interfaces/custom-request.interface';
import { Partner } from '../../../entity/partner.entity';
import { PlatformListDto } from './dto/platform-list.dto';
import { CreatePlatformDto } from './dto/create-new-platform.dto';
import { UpdatePlatformDto } from './dto/update-one-platform.dto';
import { GameHasPlatform } from '../../../entity/game_has_platform.entity';

@Injectable({ scope: Scope.REQUEST })
export class PlatformService {
    constructor(
        @InjectRepository(Platform)
        private platformRepository: Repository<Platform>,
        @InjectRepository(GameHasPlatform)
        private gameHasPlatformRepository: Repository<GameHasPlatform>,
        @Inject(REQUEST) private readonly request: CustomRequest,
    ) {}

    async findAll(payload: any) {
        try {
            const { name, status } = payload;

            const queryBuilder = this.platformRepository.createQueryBuilder('platform');

            queryBuilder.orderBy('platform.id', 'DESC');

            if (name) queryBuilder.andWhere('platform.name LIKE :name', { name: `%${name}%` });

            if (status) queryBuilder.andWhere('platform.status = :status', { status });

            const entities = await queryBuilder.getMany();

            const permissions = entities.map((per) => new PlatformListDto(per));

            return permissions;
        } catch (error) {
            logger.error('Lỗi khi lấy danh sách nền tảng.');
            logger.error(error.stack);
            return null;
        }
    }

    async findOne(id: number) {
        try {
            return await this.platformRepository.findOne({ where: { id } });
        } catch (error) {
            logger.error('Lỗi lấy chi tiết nền tảng.');
            logger.error(error.stack);
            return null;
        }
    }

    async findselect() {
        try {
            const queryBuilder = this.platformRepository
                .createQueryBuilder('platform')
                .select(['platform.id', 'platform.name'])
                .where('platform.status = :status', { status: 1 });

            const entities = await queryBuilder.getMany();
            return entities;
        } catch (error) {
            logger.error('Lỗi lấy chi tiết nền tảng.');
            logger.error(error.stack);
            return null;
        }
    }

    async create(createNewDto: CreatePlatformDto) {
        try {
            const user = this.request.user;
            const payload = this.platformRepository.create({
                ...createNewDto,
                created_by: user.userId,
                updated_by: user.userId,
            });
            const saved = await this.platformRepository.save(payload);

            return saved;
        } catch (error) {
            logger.error('Lỗi khi tạo mới nền tảng.');
            logger.error(error.stack);
            return null;
        }
    }

    async update(id: number, dataDto: UpdatePlatformDto) {
        try {
            const user = this.request.user;
            const dataDetail = await this.platformRepository.findOne({ where: { id } });
            if (!dataDetail) {
                logger.error(`Không tìm thấy nền tảng với ID ${id}`);
                throw new NotFoundException(`Không tìm thấy nền tảng với ID ${id}`);
            }

            // Cập nhật thông tin nền tảng
            const updated = plainToClass(Partner, {
                ...dataDetail,
                ...dataDto,
                updated_by: user.userId,
            });
            return await this.platformRepository.save(updated);
        } catch (error) {
            if (error.name === 'QueryFailedError' && error.message.includes('invalid input syntax for type uuid')) {
                logger.error(`ID quyền "${id}" không hợp lệ.`);
            } else {
                logger.error('Lỗi khi cập nhật nền tảng.');
                logger.error(error.stack);
            }
            return null;
        }
    }

    async delete(id: number) {
        try {
            const countPlatformUsed = await this.gameHasPlatformRepository
                .createQueryBuilder('game_has_platform')
                .where('platform_id')
                .getCount();
            if (countPlatformUsed > 0) return;
            await this.platformRepository.delete(id);
        } catch (error) {
            logger.error('Lỗi khi xóa nền tảng.');
            logger.error(error.stack);
            return null;
        }
    }
}
