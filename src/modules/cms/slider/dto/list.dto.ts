import { formatDateTime } from '../../../../utils/datetime.util';

export class ListSliderDto {
    id: number;
    title: string;
    position: number;
    slug: string;
    image: string;
    status: number;

    constructor(data: any) {
        this.id = data.id ?? '';
        this.title = data.sliderTranslate ? data.sliderTranslate[0].title : '';
        this.position = data.position ?? '';
        this.slug = data.slug ?? '';
        this.image = data.image ?? '';
        this.status = data.status ?? '';
    }
}
