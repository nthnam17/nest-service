import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { GeneralTranslate } from './general_translate.entity';

@Entity()
export class General {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    favicon: string;

    @Column()
    logo: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column()
    link: string;

    @Column()
    map: string;

    @Column()
    add_header: string;

    @Column()
    add_body: string;

    @Column()
    src_analytics: string;

    @Column()
    inner_analytics: string;

    @Column()
    business_license: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', transformer: dateTimeTransformer })
    created_at: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
        transformer: dateTimeTransformer,
    })
    updated_at: Date;

    @OneToMany(() => GeneralTranslate, (generalTranslare) => generalTranslare.general)
    generalTranslate: GeneralTranslate[];
}
