import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, RelationId } from 'typeorm';
import { HomePage } from './home_page.entity';

@Entity()
export class HomePageTranslate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    slogun: string;

    @Column()
    meta_title: string;

    @Column()
    meta_description: string;

    @Column()
    meta_keyword: string;

    @Column()
    lang_code: string;

    @ManyToOne(() => HomePage, (homePage) => homePage.homePageTranslate)
    homePage: HomePage;
}
