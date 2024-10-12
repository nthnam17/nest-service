import { formatDateTime } from '../../../../utils/datetime.util';

export class ListGamePackageDto {
    id: number;
    title: string;
    image: string;
    description: string;
    price: number;
    status: number;
    is_hot: number;
    created_at: string;
    updated_at: string;

    constructor(value: any) {
        this.id = value.id ?? '';
        this.title = value.gamePackageTranslate ? value.gamePackageTranslate[0].title : '';
        this.image = value.image ?? '';
        this.description = value.gamePackageTranslate ? value.gamePackageTranslate[0].description : '';
        this.price = value.price ?? '';
        this.status = value.status ?? '';
        this.is_hot = value.is_hot ?? '';
        this.created_at = value.created_at ? formatDateTime(value.created_at) : '';
        this.updated_at = value.updated_at ? formatDateTime(value.updated_at) : '';
    }
}
