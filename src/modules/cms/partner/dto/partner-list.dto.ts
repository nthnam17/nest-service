import { formatDateTime } from '../../../../utils/datetime.util';

export class PartnerListDto {
    id: number;
    name: string;
    image: string;
    status: string;
    created_at: string;
    updated_at: string;

    constructor(per: any) {
        this.id = per.id;
        this.name = per.name;
        this.image = per.image;
        this.status = per.status;
        this.created_at = per.created_at ? formatDateTime(per.created_at) : '';
        this.updated_at = per.updated_at ? formatDateTime(per.updated_at) : '';
    }
}
