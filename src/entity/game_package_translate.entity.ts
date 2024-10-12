import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, RelationId } from 'typeorm';
import { GamePackage } from './game_package.entity';

@Entity()
export class GamePackageTranslate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    lang_code: string;

    @ManyToOne(() => GamePackage, (GamePackage) => GamePackage.gamePackageTranslate)
    gamePackage: GamePackage;
}
