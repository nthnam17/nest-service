import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { NewsTranslate } from './news_translate.entity';
import { Exclude } from 'class-transformer';
import { User } from './user.entity';

@Entity()
export class News {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    slug: string;

    @Column()
    image: string;

    @Column({ default: 2 })
    status: number;

    @Column({ default: 2 })
    is_hot: number;

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

    @OneToMany(() => NewsTranslate, (newsTranslate) => newsTranslate.news)
    @Exclude()
    newsTranslate: NewsTranslate[];

    @ManyToOne(() => User, (user) => user.news)
    @JoinColumn({ name: 'updated_by' })
    user: User;
}
