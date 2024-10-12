import { ApiProperty } from '@nestjs/swagger';
import { SortOption } from '../../../../common/types/sort.type';

export class FilterContactDto {
    @ApiProperty({ required: false })
    pageSize: number;

    @ApiProperty({ required: false })
    pageIndex: number;

    @ApiProperty({ required: false })
    keyword: string;

    @ApiProperty({ required: false })
    gameId: number;

    @ApiProperty({ required: false })
    type_code: string;
}
