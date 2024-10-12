import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import logger from '../../../common/logger';
import { PageBase } from '../../../common/response/response-page-base';
import { plainToClass } from 'class-transformer';
import { CustomRequest } from '../../../interfaces/custom-request.interface';
import { Partner } from '../../../entity/partner.entity';
import { PartnerListDto } from './dto/partner-list.dto';
import { CreateNewsPartnerDto } from './dto/create-new-partner.dto';
import { UpdatePartnerDto } from './dto/update-one-partner.dto';

@Injectable({ scope: Scope.REQUEST })
export class PartnerService {
    constructor(
        @InjectRepository(Partner)
        private partnerRepository: Repository<Partner>,
        @Inject(REQUEST) private readonly request: CustomRequest,
    ) {}

    async findAll(payload: any) {
        try {
            const { name, pageIndex = 1, pageSize = 20, sort, status } = payload;

            const queryBuilder = this.partnerRepository.createQueryBuilder('partner');

            if (sort) {
                queryBuilder.orderBy(`partner.${sort.field}`, sort.order.toUpperCase() as 'ASC' | 'DESC');
            } else {
                queryBuilder.orderBy(`partner.id`, 'DESC');
            }

            if (name) queryBuilder.andWhere('partner.name LIKE :name', { name: `%${name}%` });

            if (status) queryBuilder.andWhere('partner.status = :status', { status });

            const [entities, totalItems] = await Promise.all([
                queryBuilder
                    .offset((pageIndex - 1) * pageSize)
                    .limit(pageSize)
                    .getMany(),
                queryBuilder.getCount(),
            ]);

            const permissions = entities.map((per) => new PartnerListDto(per));

            const pageResult = new PageBase(pageIndex, pageSize, totalItems, permissions);
            return pageResult;
        } catch (error) {
            logger.error('Lỗi khi lấy danh sách đối tác.');
            logger.error(error.stack);
            return null;
        }
    }

    async findOne(id: number) {
        try {
            return await this.partnerRepository.findOne({ where: { id } });
        } catch (error) {
            logger.error('Lỗi lấy chi tiết đối tác.');
            logger.error(error.stack);
            return null;
        }
    }

    async findByField(fieldName: string, value: string) {
        try {
            const queryBuilder = this.partnerRepository.createQueryBuilder('p');
            queryBuilder.where(`p.${fieldName} = :value`, { value });
            const entity = await queryBuilder.getOne();

            return entity;
        } catch (error) {
            logger.error('Lỗi lấy chi tiết đối tác.');
            logger.error(error.stack);
            return null;
        }
    }

    async create(createNewDto: CreateNewsPartnerDto) {
        try {
            const payload = this.partnerRepository.create({
                ...createNewDto,
            });
            const saved = await this.partnerRepository.save(payload);

            return saved;
        } catch (error) {
            logger.error('Lỗi khi tạo mới đối tác.');
            logger.error(error.stack);
            return null;
        }
    }

    async update(id: number, dataDto: UpdatePartnerDto) {
        try {
            // Kiểm tra xem quyền có tồn tại không
            const dataDetail = await this.partnerRepository.findOne({ where: { id } });
            if (!dataDetail) {
                logger.error(`Không tìm thấy đối tác với ID ${id}`);
                throw new NotFoundException(`Không tìm thấy đối tác với ID ${id}`);
            }

            // Cập nhật thông tin đối tác
            const updated = plainToClass(Partner, {
                ...dataDetail,
                ...dataDto,
            });
            return await this.partnerRepository.save(updated);
        } catch (error) {
            if (error.name === 'QueryFailedError' && error.message.includes('invalid input syntax for type uuid')) {
                logger.error(`ID quyền "${id}" không hợp lệ.`);
            } else {
                logger.error('Lỗi khi cập nhật đối tác.');
                logger.error(error.stack);
            }
            return null;
        }
    }

    async delete(id: number) {
        try {
            await this.partnerRepository.delete(id);
        } catch (error) {
            logger.error('Lỗi khi xóa đối tác.');
            logger.error(error.stack);
            return null;
        }
    }
}
