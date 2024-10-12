import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SliderTranslate } from './slider_translate.entity';

@Entity()
export class Slider {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    position: number;

    @Column()
    slug: string;

    @Column()
    image: string;

    @Column()
    status: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', transformer: dateTimeTransformer })
    created_at: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
        transformer: dateTimeTransformer,
    })
    updated_at: Date;

    @Column({ nullable: true })
    created_by: number;

    @Column({ nullable: true })
    updated_by: number;

    @OneToMany(() => SliderTranslate, (sliderTranslate) => sliderTranslate.slider)
    sliderTranslate: SliderTranslate[];
}
