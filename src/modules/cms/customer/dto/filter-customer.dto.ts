import { ApiProperty } from '@nestjs/swagger';
import { SortOption } from '../../../../common/types/sort.type';

export class FilterCustomerDto {
    @ApiProperty({ required: false })
    keyword: string;

    @ApiProperty({ required: false })
    status: number;

    @ApiProperty({ required: false })
    pageSize: number;

    @ApiProperty({ required: false })
    pageIndex: number;
}
