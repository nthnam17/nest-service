import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, RelationId } from 'typeorm';

@Entity()
export class GameHasPlatform {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    game_id: number;

    @Column()
    platform_id: number;
}
