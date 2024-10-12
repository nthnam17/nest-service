import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Game } from './game.entity';

@Entity()
export class Contact {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullName: string;

    @Column()
    phone: string;

    @Column()
    email: string;

    @Column()
    type_code: string;

    @Column()
    company_name: string;

    @Column({ nullable: true })
    gameId: number;

    @Column({ nullable: true })
    updated_by: number;

    @Column()
    message: string;

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

    @ManyToOne(() => User, (user) => user.contact)
    @JoinColumn({ name: 'updated_by' })
    user: User;

    @ManyToOne(() => Game, (game) => game.contact)
    game: Game;
}
