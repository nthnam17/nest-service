import { GalaxyTranslate } from './../../../../entity/galaxy_translate.entity';
import { formatDateTime } from '../../../../utils/datetime.util';

export class ListGalaxyDto {
    id: number;
    image: string;
    title: string;
    description: string;
    created_by: string;
    created_at: string;
    updated_at: string;

    constructor(value: any) {
        this.id = value.id ?? '';
        this.title = value.galaxyTranslate.length > 0 ? value.galaxyTranslate[0].title : '';
        this.image = value.image ?? '';
        this.description = value.galaxyTranslate.length > 0 ? value.galaxyTranslate[0].description : '';
        this.created_at = value.created_at ? formatDateTime(value.created_at) : '';
        this.updated_at = value.updated_at ? formatDateTime(value.updated_at) : '';
    }
}
