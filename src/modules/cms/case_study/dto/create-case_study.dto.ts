import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

class TranslateCaseStudyDto {
    @IsNotEmpty({ message: 'Tên không được để trống' })
    @ApiProperty()
    name: string;

    @ApiProperty()
    content: string;
}

export class CreateCaseStudyDto {
    @IsNotEmpty({ message: 'Không được để trống' })
    @ApiProperty()
    slug: string;

    @ApiProperty()
    date_to: Date;

    @ApiProperty()
    date_from: Date;

    @ApiProperty()
    image: string;

    @ApiProperty()
    customerId: number;

    @ApiProperty()
    status: number;

    @ApiProperty()
    @ValidateNested()
    @Type(() => TranslateCaseStudyDto)
    VI: TranslateCaseStudyDto;

    @ApiProperty()
    @ValidateNested()
    @Type(() => TranslateCaseStudyDto)
    EN: TranslateCaseStudyDto;
}
