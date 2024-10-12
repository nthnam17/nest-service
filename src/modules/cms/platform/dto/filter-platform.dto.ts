import { ApiProperty } from '@nestjs/swagger';
import { SortOption } from '../../../../common/types/sort.type';

export class FilterPlatformDto {
    @ApiProperty({ required: false })
    name: string;

    @ApiProperty({ required: false })
    status: number;
}
