import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import logger from '../../../common/logger';
import { PageBase } from '../../../common/response/response-page-base';
import { plainToClass } from 'class-transformer';
import { CustomRequest } from '../../../interfaces/custom-request.interface';
import { Contact } from './../../../entity/contact.entity';
import { ListContactDto } from './dto/list-contact.dto';

@Injectable({ scope: Scope.REQUEST })
export class ContactService {
    constructor(
        @InjectRepository(Contact)
        private contactRepository: Repository<Contact>,
        @Inject(REQUEST) private readonly request: CustomRequest,
    ) {}

    async findAll(params: any) {
        try {
            const { pageIndex = 1, pageSize = 20, keyword, gameId, type_code } = params;

            const queryBuilder = this.contactRepository
                .createQueryBuilder('contact')
                .leftJoinAndSelect('contact.user', 'user')
                .leftJoinAndSelect('contact.game', 'game')
                .leftJoinAndSelect('game.gameTranslate', 'gameTranslate')
                .leftJoinAndSelect('game.gameType', 'gameType')
                .select([
                    'contact.id',
                    'contact.fullName',
                    'contact.phone',
                    'contact.email',
                    'contact.message',
                    'contact.created_at',
                    'contact.status',
                    'contact.type_code',
                    'contact.company_name',
                    'user.name',
                    'game.id',
                    'game.slug',
                    'gameTranslate.name',
                    'gameType.slug',
                ]);
            if (keyword) {
                queryBuilder
                    .where('contact.fullName LIKE :keyword', { keyword: `${keyword}` })
                    .orWhere('contact.phone LIKE :keyword', { keyword: `${keyword}` })
                    .orWhere('contact.email LIKE :keyword', { keyword: `${keyword}` })
                    .orWhere('contact.company_name LIKE :keyword', { keyword: `${keyword}` });
            }

            if (type_code) queryBuilder.andWhere('contact.type_code = :type_code', { type_code: type_code });
            if (gameId) queryBuilder.andWhere('game.id = :gameId', { gameId: gameId });

            queryBuilder.orderBy(`contact.id`, 'DESC');

            const [entities, totalItems] = await Promise.all([
                queryBuilder
                    .offset((pageIndex - 1) * pageSize)
                    .limit(pageSize)
                    .getMany(),
                queryBuilder.getCount(),
            ]);

            const entitesDto = entities.map((item) => new ListContactDto(item));

            const pageResult = new PageBase(pageIndex, pageSize, totalItems, entitesDto);

            return pageResult;
        } catch (error) {
            logger.error('Lỗi khi lấy danh sách thông tin liên hệ.');
            logger.error(error.stack);
            return null;
        }
    }

    async findOne(id: number) {
        try {
            return await this.contactRepository.findOne({
                where: { id: Number(id) },
            });
        } catch (error) {
            logger.error('Lỗi lấy chi tiết thông tin liên hệ.');
            logger.error(error.stack);
            return null;
        }
    }

    async changeStatus(id: number) {
        try {
            const user = this.request.user;
            const dataDetail = await this.contactRepository.findOne({
                where: { id: Number(id) },
            });
            if (!dataDetail) {
                logger.error(`Không tìm thấy liên hệ với ID ${id}`);
                throw new NotFoundException(`Không tìm thấy liên hệ với ID ${id}`);
            }

            const statusNew = dataDetail.status == 2 ? 1 : 2;

            const updateData = plainToClass(Contact, {
                ...dataDetail,
                status: statusNew,
                updated_by: user.userId,
            });

            const data = this.contactRepository.save(updateData);

            return data;
        } catch (error) {
            logger.error('Lỗi chuyển trạng thái thông tin liên hệ.');
            logger.error(error.stack);
            return null;
        }
    }

    async delete(data: any) {
        try {
            await this.contactRepository.delete(data.id);
        } catch (error) {
            logger.error('Lỗi khi xóa thông tin liên hệ');
            logger.error(error.stack);
            return null;
        }
    }
}
