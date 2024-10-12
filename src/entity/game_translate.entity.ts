import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, RelationId } from 'typeorm';
import { GameType } from './game_type.entity';
import { Game } from './game.entity';

@Entity()
export class GameTranslate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    content: string;

    @Column()
    description: string;

    @Column()
    lang_code: string;

    @Column()
    meta_keyword: string;

    @Column()
    meta_description: string;

    @Column()
    meta_title: string;

    @ManyToOne(() => Game, (game) => game.gameTranslate)
    game: Game;
}
