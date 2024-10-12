import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { CaseStudyTranslate } from './case_study_translate.entity';
import { Customer } from './customer.entity';

@Entity()
export class CaseStudy {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    slug: string;

    @Column()
    image: string;

    @Column()
    customerId: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', transformer: dateTimeTransformer })
    date_to: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', transformer: dateTimeTransformer })
    date_from: Date;

    @Column()
    status: number;

    @Column({ default: 1 })
    created_by: number;

    @Column({ default: 1 })
    updated_by: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', transformer: dateTimeTransformer })
    created_at: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
        transformer: dateTimeTransformer,
    })
    updated_at: Date;

    @OneToMany(() => CaseStudyTranslate, (caseStudyTranslate) => caseStudyTranslate.caseStudy)
    caseStudyTranslate: CaseStudyTranslate[];

    @ManyToOne(() => Customer, (customer) => customer.caseStudy)
    customer: Customer;
}
