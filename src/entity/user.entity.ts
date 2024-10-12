import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { News } from './news.entity';
import { Game } from './game.entity';
import { Contact } from './contact.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    email: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    image: string;

    @Column({ default: 0 })
    status: number;

    @Column({ nullable: true })
    role_id: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', transformer: dateTimeTransformer })
    created_at: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
        transformer: dateTimeTransformer,
    })
    updated_at: Date;

    @Column()
    created_by: number;

    @Column()
    updated_by: number;

    @OneToMany(() => News, (news) => news.user)
    news: News[];

    @OneToMany(() => Game, (game) => game.user)
    game: Game[];

    @OneToMany(() => Contact, (contact) => contact.user)
    contact: Contact[];
}
