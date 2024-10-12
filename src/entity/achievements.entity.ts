import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { GalaxyTranslate } from './galaxy_translate.entity';
import { AchievementsTranslate } from './achievements_translate.entity';

@Entity()
export class Achievements {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    homePageId: number;

    @Column()
    count: number;

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

    @OneToMany(() => AchievementsTranslate, (achievementsTranslate) => achievementsTranslate.achievements)
    achievementsTranslate: AchievementsTranslate[];
}
