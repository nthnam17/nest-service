import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { GameTypeTranslate } from './game_type_translate.entity';
import { Game } from './game.entity';

@Entity()
export class GameType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    slug: string;

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

    @OneToMany(() => GameTypeTranslate, (gameTypeTranslate) => gameTypeTranslate.gameType)
    gameTypeTranslate: GameTypeTranslate[];

    @ManyToMany(() => Game, (game) => game.gameType)
    game: Game[];
}
