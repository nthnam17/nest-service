import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { GamePackageTranslate } from './game_package_translate.entity';

@Entity()
export class GamePackage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    image: string;

    @Column()
    price: number;

    @Column()
    is_hot: number;

    @Column()
    status: number;

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

    @OneToMany(() => GamePackageTranslate, (gamePackageTranslate) => gamePackageTranslate.gamePackage)
    gamePackageTranslate: GamePackageTranslate[];
}
