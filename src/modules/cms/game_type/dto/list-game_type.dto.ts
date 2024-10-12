import { formatDateTime } from '../../../../utils/datetime.util';

export class ListGameTypeDto {
    id: number;
    title: string;
    slug: string;
    created_at: string;
    updated_at: string;

    constructor(value: any) {
        this.id = value.id ?? '';
        this.title = value.gameTypeTranslate ? value.gameTypeTranslate[0].title : '';
        this.slug = value.slug ?? '';
        this.created_at = value.created_at ? formatDateTime(value.created_at) : '';
        this.updated_at = value.updated_at ? formatDateTime(value.updated_at) : '';
    }
}
