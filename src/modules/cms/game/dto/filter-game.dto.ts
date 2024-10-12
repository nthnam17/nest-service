import { ApiProperty } from '@nestjs/swagger';
import { SortOption } from '../../../../common/types/sort.type';

export class FilterGameDto {
    @ApiProperty({ required: false })
    pageSize: number;

    @ApiProperty({ required: false })
    pageIndex: number;

    @ApiProperty({ required: false })
    status: number;

    @ApiProperty({ required: false })
    is_hot: number;

    @ApiProperty({ required: false })
    name: string;

    @ApiProperty({ required: false })
    gameType: string;

    @ApiProperty({ required: false })
    sort: SortOption;
}
