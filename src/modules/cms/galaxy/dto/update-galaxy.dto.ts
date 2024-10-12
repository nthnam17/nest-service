import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

class TranslateGalaxyDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Tiêu đề không được để chống' })
    title: string;

    @ApiProperty()
    description: string;
}

export class UpdateGalaxyDto {
    @ApiProperty()
    image: string;

    @ApiProperty()
    homePageId: number;

    @ApiProperty()
    @ValidateNested()
    @Type(() => TranslateGalaxyDto)
    VI: TranslateGalaxyDto;

    @ApiProperty()
    @ValidateNested()
    @Type(() => TranslateGalaxyDto)
    EN: TranslateGalaxyDto;
}
