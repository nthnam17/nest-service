import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { General } from './general.entity';

@Entity()
export class GeneralTranslate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    lang_code: string;

    @Column()
    title: string;

    @Column()
    address: string;

    @ManyToOne(() => General, (general) => general.generalTranslate)
    general: General;
}
