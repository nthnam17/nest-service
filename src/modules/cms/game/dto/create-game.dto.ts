import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

class TranslateGameCreateDto {
    @IsNotEmpty({ message: 'Không được để trống' })
    @ApiProperty()
    name: string;

    @IsNotEmpty({ message: 'Không được để trống' })
    @ApiProperty()
    meta_keyword: string;

    @IsNotEmpty({ message: 'Không được để trống' })
    @ApiProperty()
    meta_description: string;

    @IsNotEmpty({ message: 'Không được để trống' })
    @ApiProperty()
    meta_title: string;

    @IsNotEmpty({ message: 'Không được để trống' })
    @ApiProperty()
    content: string;

    @ApiProperty()
    description: string;
}

export class CreateGameDto {
    @ApiProperty()
    slug: string;

    @ApiProperty()
    rate: number;

    @ApiProperty()
    vote: number;

    @ApiProperty()
    iframe: string;

    @ApiProperty()
    thumbnail: string;

    @ApiProperty()
    status: number;

    @ApiProperty()
    is_hot: number;

    @ApiProperty({ type: [Number], example: [1, 2, 3], description: 'Danh sách thể loại của game' })
    gameType: number[];

    @ApiProperty({ type: [Number], example: [4, 5, 6], description: 'Danh sách nền tảng của game' })
    platform: number[];

    @ApiProperty()
    @ValidateNested()
    @Type(() => TranslateGameCreateDto)
    VI: TranslateGameCreateDto;

    @ApiProperty()
    @ValidateNested()
    @Type(() => TranslateGameCreateDto)
    EN: TranslateGameCreateDto;
}
