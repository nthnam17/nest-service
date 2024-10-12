import { Game } from './../../../../entity/game.entity';
import { GameTranslate } from './../../../../entity/game_translate.entity';
import { GalaxyTranslate } from './../../../../entity/galaxy_translate.entity';
import { formatDateTime } from '../../../../utils/datetime.util';
import { log } from 'util';

export class ListContactDto {
    id: number;
    fullName: string;
    phone: string;
    email: string;
    message: string;
    type_code: string;
    created_at: string;
    updated_by: string;
    status: number;
    game_name: string;
    company_name: string;
    game_type_slug: string;
    game_slug: string;

    constructor(value: any) {
        this.id = value.id ?? '';
        this.fullName = value.fullName ?? '';
        this.phone = value.phone ?? '';
        this.email = value.email ?? '';
        this.company_name = value.company_name ?? '';
        this.message = value.message ?? '';
        this.updated_by = value.user ? value.user.name : '';
        this.status = value.status ?? '';
        this.type_code = value.type_code ?? '';
        this.game_name = value.game ? value.game.gameTranslate[0].name : '';
        this.game_slug = value.game ? value.game.slug : '';
        this.game_type_slug = value.game ? value.game.gameType[0].slug : '';
        this.created_at = value.created_at ? formatDateTime(value.created_at) : '';
    }
}
