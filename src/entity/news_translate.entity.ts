import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, RelationId } from 'typeorm';
import { News } from './news.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class NewsTranslate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    meta_title: string;

    @Column()
    meta_description: string;

    @Column()
    meta_keyword: string;

    @Column()
    title: string;

    @Column()
    lang_code: string;

    @Column()
    content: string;

    @Column()
    description: string;

    @ManyToOne(() => News, (news) => news.newsTranslate)
    @Exclude()
    news: News;
}
