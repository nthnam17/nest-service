import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, RelationId } from 'typeorm';
import { GameType } from './game_type.entity';

@Entity()
export class GameTypeTranslate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    lang_code: string;

    @ManyToOne(() => GameType, (gameType) => gameType.gameTypeTranslate)
    gameType: GameType;
}
