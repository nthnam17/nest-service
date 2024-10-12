import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, RelationId } from 'typeorm';
import { News } from './news.entity';
import { Exclude } from 'class-transformer';
import { Galaxy } from './galaxy.entity';

@Entity()
export class GalaxyTranslate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    lang_code: string;

    @Column()
    description: string;

    @ManyToOne(() => Galaxy, (galaxy) => galaxy.galaxyTranslate)
    galaxy: Galaxy;
}
