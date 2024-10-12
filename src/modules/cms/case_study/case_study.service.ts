import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import logger from '../../../common/logger';
import { PageBase } from '../../../common/response/response-page-base';
import { plainToClass } from 'class-transformer';
import { CustomRequest } from '../../../interfaces/custom-request.interface';
import { CaseStudy } from './../../../entity/case_study.entity';
import { CaseStudyTranslate } from './../../../entity/case_study_translate.entity';
import { CreateCaseStudyDto } from './dto/create-case_study.dto';
import { generateSlug } from './../../../utils/toslug.util';
import { ListCaseStudyDto } from './dto/list-case_study.dto';
import { FilterCaseStudyDto } from './dto/filter-case_study.dto';
import { UpdateCaseStudyDto } from './dto/update-case_study.dto';

@Injectable({ scope: Scope.REQUEST })
export class CaseStudyService {
    constructor(
        @InjectRepository(CaseStudy)
        private caseStudyRepository: Repository<CaseStudy>,
        @InjectRepository(CaseStudyTranslate)
        private caseStudyTranslateRepository: Repository<CaseStudyTranslate>,
        @Inject(REQUEST) private readonly request: CustomRequest,
    ) {}

    async findAll(payload: FilterCaseStudyDto) {
        try {
            const { status, name, pageIndex = 1, pageSize = 20 } = payload;

            const queryBuilder = this.caseStudyRepository
                .createQueryBuilder('case_study')
                .leftJoinAndSelect('case_study.caseStudyTranslate', 'caseStudyTranslate')
                .leftJoinAndSelect('case_study.customer', 'customer')
                .select([
                    'case_study.id',
                    'case_study.image',
                    'case_study.slug',
                    'case_study.date_to',
                    'case_study.date_from',
                    'case_study.created_at',
                    'case_study.updated_at',
                    'case_study.status',
                    'customer.name',
                    'caseStudyTranslate.name',
                ]);

            queryBuilder.orderBy('case_study.created_at', 'DESC');

            queryBuilder.where('caseStudyTranslate.lang_code = :lang_code', { lang_code: process.env.FALLBACK_LANG });

            if (name) {
                queryBuilder.andWhere('caseStudyTranslate.name LIKE :name', { name: `%${name}%` });
            }

            if (status) queryBuilder.andWhere('case_study.status = :status', { status: status });

            const [entities, totalItems] = await Promise.all([
                queryBuilder
                    .offset((pageIndex - 1) * pageSize)
                    .limit(pageSize)
                    .getMany(),
                queryBuilder.getCount(),
            ]);

            const entitesDto = entities.map((item) => new ListCaseStudyDto(item));

            const pageResult = new PageBase(pageIndex, pageSize, totalItems, entitesDto);

            return pageResult;
        } catch (error) {
            logger.error('Lỗi khi lấy danh sách chiến dịch điển hình.');
            logger.error(error.stack);
            return null;
        }
    }

    async findOne(id: number) {
        try {
            const entity = await this.caseStudyRepository.findOne({
                where: { id: Number(id) },
                relations: ['caseStudyTranslate'],
            });

            const data = {
                ...entity,
                caseStudyTranslate: entity.caseStudyTranslate.reduce((acc, item) => {
                    acc[item.lang_code] = item;
                    return acc;
                }, {}),
            };

            return data;
        } catch (error) {
            logger.error('Lỗi lấy chi tiết chiến dịch điển hình.');
            logger.error(error.stack);
            return null;
        }
    }

    async findByField(fieldName: string, value: string) {
        try {
            const queryBuilder = this.caseStudyRepository.createQueryBuilder('case_study');
            queryBuilder.where(`case_study.${fieldName} = :value`, { value });
            const entity = await queryBuilder.getOne();
            return entity;
        } catch (error) {
            logger.error('Lỗi lấy chi tiết.');
            logger.error(error.stack);
            return null;
        }
    }

    async create(createNewDto: CreateCaseStudyDto) {
        try {
            const user = this.request.user;
            const caseStudy = new CaseStudy();
            let slug = createNewDto.slug ? createNewDto.slug : generateSlug(createNewDto.EN.name);
            caseStudy.slug = slug;
            caseStudy.date_to = createNewDto.date_to;
            caseStudy.date_from = createNewDto.date_from;
            caseStudy.image = createNewDto.image;
            caseStudy.status = createNewDto.status;
            caseStudy.customerId = createNewDto.customerId;
            caseStudy.created_by = user.userId;
            caseStudy.updated_by = user.userId;

            const savedCaseStudy = await this.caseStudyRepository.save(caseStudy);

            const viTranslation = plainToClass(CaseStudyTranslate, {
                ...createNewDto.VI,
                lang_code: 'VI',
            });

            viTranslation.caseStudy = savedCaseStudy;

            const enTranslation = plainToClass(CaseStudyTranslate, {
                ...createNewDto.EN,
                lang_code: 'EN',
            });
            enTranslation.caseStudy = savedCaseStudy;

            await this.caseStudyTranslateRepository.save([viTranslation, enTranslation]);

            return savedCaseStudy;
        } catch (error) {
            logger.error('Lỗi khi tạo mới chiến dịch điển hình.');
            logger.error(error.stack);
            return null;
        }
    }

    async update(id: number, dataDto: UpdateCaseStudyDto) {
        try {
            const dataDetail = await this.caseStudyRepository.findOne({
                where: { id: id },
                relations: ['caseStudyTranslate'],
            });
            if (!dataDetail) {
                logger.error(`Không tìm thấy thông tin với ID ${id}`);
                throw new NotFoundException(`Không tìm thấy thông tin với ID ${id}`);
            }

            const user = this.request.user;
            let slug = dataDto.slug ? dataDto.slug : dataDetail.slug;
            const caseStudyUpdate = plainToClass(CaseStudy, {
                ...dataDetail,
                slug: slug,
                date_to: dataDto.date_to,
                date_from: dataDto.date_from,
                image: dataDto.image,
                status: dataDto.status,
                customerId: dataDto.customerId,
                updated_by: user.userId,
            });

            const savedNews = await this.caseStudyRepository.save(caseStudyUpdate);

            const viTranslation = dataDetail.caseStudyTranslate.find((translation) => translation.lang_code === 'VI');

            const viTranslationUpdate = plainToClass(CaseStudyTranslate, {
                ...viTranslation,
                ...dataDto.VI,
            });

            const enTranslation = dataDetail.caseStudyTranslate.find((translation) => translation.lang_code === 'EN');
            const enTranslationUpdate = plainToClass(CaseStudyTranslate, {
                ...enTranslation,
                ...dataDto.EN,
            });

            await this.caseStudyTranslateRepository.save([viTranslationUpdate, enTranslationUpdate]);

            return savedNews;
        } catch (error) {
            if (error.name === 'QueryFailedError' && error.message.includes('invalid input syntax for type uuid')) {
                logger.error(`ID chiến dịch "${id}" không hợp lệ.`);
            } else {
                logger.error('Lỗi khi cập nhật thông tin');
                logger.error(error.stack);
            }
            return null;
        }
    }

    async delete(data: any) {
        try {
            await this.caseStudyTranslateRepository.delete(data.caseStudyTranslate.VI.id);
            await this.caseStudyTranslateRepository.delete(data.caseStudyTranslate.EN.id);
            await this.caseStudyRepository.delete(data.id);
        } catch (error) {
            logger.error('Lỗi khi xóa thông tin');
            logger.error(error.stack);
            return null;
        }
    }
}
