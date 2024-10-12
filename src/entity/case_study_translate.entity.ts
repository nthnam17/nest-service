import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Benefit } from './benefit.entity';
import { CaseStudy } from './case_study.entity';

@Entity()
export class CaseStudyTranslate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    lang_code: string;

    @Column()
    content: string;

    @ManyToOne(() => CaseStudy, (caseStudy) => caseStudy.caseStudyTranslate)
    caseStudy: CaseStudy;
}
