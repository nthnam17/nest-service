import { formatDateTime } from '../../../../utils/datetime.util';

export class ListGameDto {
    id: number;
    name: string;
    thumbnail: string;
    status: number;
    is_hot: number;
    vote: number;
    rate: number;
    gameType: {
        id: number;
        name: string;
    };
    created_by: string;
    created_at: string;
    updated_at: string;

    constructor(value: any) {
        this.id = value.id ?? '';
        this.name = value.gameTranslate ? value.gameTranslate[0].name : '';
        this.thumbnail = value.thumbnail ?? '';
        this.vote = value.vote ?? '';
        this.rate = value.rate ?? '';
        this.status = value.status ?? '';
        this.gameType = value.gameType
            ? value.gameType.map((type) => ({
                  id: type.id,
                  name: type.gameTypeTranslate ? type.gameTypeTranslate[0].title : [],
              }))
            : [
                  {
                      id: '',
                      name: '',
                  },
              ];
        this.is_hot = value.is_hot ?? '';
        this.created_by = value.user.name ?? '';
        this.created_at = value.created_at ? formatDateTime(value.created_at) : '';
        this.updated_at = value.updated_at ? formatDateTime(value.updated_at) : '';
    }
}
