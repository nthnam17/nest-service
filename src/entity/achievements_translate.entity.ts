import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, RelationId } from 'typeorm';
import { News } from './news.entity';
import { Exclude } from 'class-transformer';
import { Galaxy } from './galaxy.entity';
import { Achievements } from './achievements.entity';

@Entity()
export class AchievementsTranslate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    lang_code: string;

    @ManyToOne(() => Achievements, (achievements) => achievements.achievementsTranslate)
    achievements: Achievements;
}
