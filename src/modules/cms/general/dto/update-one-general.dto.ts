import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsMobilePhone, IsNotEmpty, ValidateNested } from 'class-validator';

class GeneralTranslateDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Không được để trống' })
    title: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Không được để trống' })
    address: string;
}

export class UpdateGeneralDto {
    @ApiProperty()
    favicon: string;

    @ApiProperty()
    logo: string;

    @ApiProperty()
    @IsEmail({}, { message: 'Định dạng Email không đúng' })
    email: string;

    @ApiProperty()
    @IsMobilePhone(null, {}, { message: 'Định dạng số điện thoại không đúng' })
    phone: string;

    @ApiProperty()
    link: string;

    @ApiProperty()
    map: string;

    @ApiProperty()
    add_header: string;

    @ApiProperty()
    add_body: string;

    @ApiProperty()
    src_analytics: string;

    @ApiProperty()
    inner_analytics: string;

    @ApiProperty()
    business_license: string;

    @ApiProperty()
    @ValidateNested()
    @Type(() => GeneralTranslateDto)
    VI: GeneralTranslateDto;

    @ApiProperty()
    @ValidateNested()
    @Type(() => GeneralTranslateDto)
    EN: GeneralTranslateDto;
}
