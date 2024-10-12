import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

class TranslatePackageGameDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Tên không được để chống' })
    title: string;

    @ApiProperty()
    description: string;
}

export class UpdatedGamePackageDto {
    @ApiProperty()
    image: string;

    @ApiProperty()
    status: number;

    @ApiProperty()
    is_hot: number;

    @ApiProperty()
    price: number;

    @ApiProperty()
    @ValidateNested()
    @Type(() => TranslatePackageGameDto)
    VI: TranslatePackageGameDto;

    @ApiProperty()
    @ValidateNested()
    @Type(() => TranslatePackageGameDto)
    EN: TranslatePackageGameDto;
}
