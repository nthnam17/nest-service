import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Benefit } from './benefit.entity';

@Entity()
export class BenefitTranslate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    benefitId: number;

    @Column()
    title: string;

    @Column()
    lang_code: string;

    @Column()
    description: string;

    @ManyToOne(() => Benefit, (benefit) => benefit.benefitTranslate)
    benefit: Benefit;
}
