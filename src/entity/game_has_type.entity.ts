import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, RelationId } from 'typeorm';

@Entity()
export class GameHasType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    game_id: number;

    @Column()
    game_type_id: number;
}
