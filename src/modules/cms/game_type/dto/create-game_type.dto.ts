import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

class TranslateTypeGameDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Tên không được để trống' })
    title: string;
}

export class CreateGameTypeDto {
    @ApiProperty()
    slug: string;

    @ApiProperty()
    @ValidateNested()
    @Type(() => TranslateTypeGameDto)
    VI: TranslateTypeGameDto;

    @ApiProperty()
    @ValidateNested()
    @Type(() => TranslateTypeGameDto)
    EN: TranslateTypeGameDto;
}
