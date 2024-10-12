import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Slider } from './slider.entity';

@Entity()
export class SliderTranslate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    lang_code: string;

    @Column()
    title: number;

    @ManyToOne(() => Slider, (slider) => slider.sliderTranslate)
    slider: Slider;
}
