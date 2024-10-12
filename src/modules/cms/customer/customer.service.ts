import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import logger from '../../../common/logger';
import { PageBase } from '../../../common/response/response-page-base';
import { plainToClass } from 'class-transformer';
import { CustomRequest } from '../../../interfaces/custom-request.interface';
import { Customer } from '../../../entity/customer.entity';
import { FilterCustomerDto } from './dto/filter-customer.dto';
import { CustomerListDto } from './dto/customer-list.dto';
import { UpdateCustomerDto } from './dto/update-one-customer.dto';

@Injectable({ scope: Scope.REQUEST })
export class CustomerService {
    constructor(
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,
        @Inject(REQUEST) private readonly request: CustomRequest,
    ) {}

    async findAll(payload: FilterCustomerDto) {
        try {
            const { keyword, status, pageIndex = 1, pageSize = 20 } = payload;

            const queryBuilder = this.customerRepository.createQueryBuilder('customer');

            queryBuilder.orderBy('customer.id', 'DESC');

            if (keyword) {
                queryBuilder
                    .where('customer.name LIKE :keyword', { keyword: `%${keyword}%` })
                    .orWhere('customer.email LIKE :keyword', { keyword: `%${keyword}%` })
                    .orWhere('customer.phone LIKE :keyword', { keyword: `%${keyword}%` });
            }

            if (status) queryBuilder.andWhere('customer.status = :status', { status });

            const [entities, totalItems] = await Promise.all([
                queryBuilder
                    .offset((pageIndex - 1) * pageSize)
                    .limit(pageSize)
                    .getMany(),
                queryBuilder.getCount(),
            ]);

            const entitesDto = entities.map((item) => new CustomerListDto(item));

            const pageResult = new PageBase(pageIndex, pageSize, totalItems, entitesDto);

            return pageResult;
        } catch (error) {
            logger.error('Lỗi khi lấy danh sách khách hàng.');
            logger.error(error.stack);
            return null;
        }
    }

    async findOne(id: number) {
        try {
            return await this.customerRepository.findOne({ where: { id } });
        } catch (error) {
            logger.error('Lỗi lấy chi tiết khách hàng.');
            logger.error(error.stack);
            return null;
        }
    }

    async findselect() {
        try {
            const queryBuilder = this.customerRepository
                .createQueryBuilder('customer')
                .select(['customer.id', 'customer.name'])
                .where('customer.status = :status', { status: 1 });

            const entities = await queryBuilder.getMany();
            return entities;
        } catch (error) {
            logger.error('Lỗi lấy danh sách chọn khách hàng.');
            logger.error(error.stack);
            return null;
        }
    }

    async create(createNewDto: any) {
        try {
            const user = this.request.user;
            const payload = this.customerRepository.create({
                ...createNewDto,
                created_by: user.userId,
                updated_by: user.userId,
            });
            const saved = await this.customerRepository.save(payload);

            return saved;
        } catch (error) {
            logger.error('Lỗi khi tạo mới khách hàng.');
            logger.error(error.stack);
            return null;
        }
    }

    async update(id: number, dataDto: UpdateCustomerDto) {
        try {
            const user = this.request.user;
            const dataDetail = await this.customerRepository.findOne({ where: { id } });
            if (!dataDetail) {
                logger.error(`Không tìm thấy khách hàng với ID ${id}`);
                throw new NotFoundException(`Không tìm thấy khách hàng với ID ${id}`);
            }

            const updated = plainToClass(Customer, {
                ...dataDetail,
                ...dataDto,
                updated_by: user.userId,
            });
            return await this.customerRepository.save(updated);
        } catch (error) {
            if (error.name === 'QueryFailedError' && error.message.includes('invalid input syntax for type uuid')) {
                logger.error(`ID khách hàng "${id}" không hợp lệ.`);
            } else {
                logger.error('Lỗi khi cập nhật khách hàng.');
                logger.error(error.stack);
            }
            return null;
        }
    }

    async delete(id: number) {
        try {
            await this.customerRepository.delete(id);
        } catch (error) {
            logger.error('Lỗi khi xóa khách hàng.');
            logger.error(error.stack);
            return null;
        }
    }
}
