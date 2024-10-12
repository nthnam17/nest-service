import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { GalaxyTranslate } from './galaxy_translate.entity';
import { HomePageTranslate } from './home_page_translate.entity';

@Entity()
export class HomePage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    slug: string;

    @Column()
    image: string;

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

    @OneToMany(() => HomePageTranslate, (homePageTranslate) => homePageTranslate.homePage)
    homePageTranslate: HomePageTranslate[];
}
