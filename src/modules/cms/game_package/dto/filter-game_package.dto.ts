import { ApiProperty } from '@nestjs/swagger';

export class FilterGamePackageDto {
    @ApiProperty({ required: false })
    status: number;

    @ApiProperty({ required: false })
    is_hot: number;

    @ApiProperty({ required: false })
    name: string;
}
