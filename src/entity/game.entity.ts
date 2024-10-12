import { dateTimeTransformer } from '../common/transformers/date-time.transformer';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { GameTypeTranslate } from './game_type_translate.entity';
import { GameTranslate } from './game_translate.entity';
import { Platform } from './platform.entity';
import { platform } from 'os';
import { User } from './user.entity';
import { GameType } from './game_type.entity';
import { Contact } from './contact.entity';

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    slug: string;

    @Column()
    rate: number;

    @Column()
    vote: number;

    @Column()
    iframe: string;

    @Column()
    thumbnail: string;

    @Column()
    status: number;

    @Column()
    is_hot: number;

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

    @OneToMany(() => GameTranslate, (gameTranslate) => gameTranslate.game)
    gameTranslate: GameTranslate[];

    @ManyToOne(() => User, (user) => user.game)
    @JoinColumn({ name: 'updated_by' })
    user: User;

    @OneToMany(() => Contact, (contact) => contact.game)
    contact: Contact[];

    @ManyToMany(() => GameType, (gameType) => gameType.game, { cascade: true })
    @JoinTable({
        name: 'game_has_type',
        joinColumn: {
            name: 'game_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'game_type_id',
            referencedColumnName: 'id',
        },
    })
    gameType: GameType[];

    @ManyToMany(() => Platform, (platform) => platform.game, { cascade: true })
    @JoinTable({
        name: 'game_has_platform',
        joinColumn: {
            name: 'game_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'platform_id',
            referencedColumnName: 'id',
        },
    })
    platform: Platform[];
}
