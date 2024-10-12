import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';

class SliderTranslateDto {
    @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
    @ApiProperty()
    title: string;
}

export class CreateSliderDto {
    @IsNotEmpty({ message: 'Đường dẫn không được để trống' })
    @ApiProperty()
    slug: string;

    @ApiProperty()
    position: string;

    @ApiProperty()
    image: string;

    @ApiProperty()
    status: number;

    @ApiProperty()
    @ValidateNested()
    @Type(() => SliderTranslateDto)
    VI: SliderTranslateDto;

    @ApiProperty()
    @ValidateNested()
    @Type(() => SliderTranslateDto)
    EN: SliderTranslateDto;
}
