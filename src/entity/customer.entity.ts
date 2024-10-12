import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CaseStudy } from './case_study.entity';

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    phone: string;

    @Column()
    email: string;

    @Column()
    address: string;

    @Column()
    company_name: string;

    @Column()
    password: string;

    @Column({ default: 1 })
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

    @OneToMany(() => CaseStudy, (caseStudy) => caseStudy.customer)
    caseStudy: CaseStudy[];
}
