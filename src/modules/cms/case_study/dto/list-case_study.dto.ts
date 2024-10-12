import { GalaxyTranslate } from './../../../../entity/galaxy_translate.entity';
import { formatDateTime } from '../../../../utils/datetime.util';

export class ListCaseStudyDto {
    id: number;
    image: string;
    slug: string;
    name: string;
    created_by: string;
    status: string;
    date_to: string;
    date_from: string;
    created_at: string;
    updated_at: string;

    constructor(value: any) {
        this.id = value.id ?? '';
        this.slug = value.slug ?? '';
        this.image = value.image ?? '';
        this.status = value.status ?? '';
        this.name = value.caseStudyTranslate ? value.caseStudyTranslate[0].name : '';
        this.date_to = value.date_to ? formatDateTime(value.date_to) : '';
        this.date_from = value.date_from ? formatDateTime(value.date_from) : '';
        this.created_by = value.customer ? value.customer.name : '';
        this.created_at = value.created_at ? formatDateTime(value.created_at) : '';
        this.updated_at = value.updated_at ? formatDateTime(value.updated_at) : '';
    }
}
