import { ApiProperty } from '@nestjs/swagger';
import { SortOption } from '../../../../common/types/sort.type';

export class FilterPartnerDto {
    @ApiProperty({ required: false })
    name: string;

    @ApiProperty({ required: false })
    pageSize: number;

    @ApiProperty({ required: false })
    pageIndex: number;

    @ApiProperty({ required: false })
    status: number;

    @ApiProperty({ required: false })
    sort: SortOption;
}
