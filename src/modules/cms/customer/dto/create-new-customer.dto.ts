import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsMobilePhone, IsNotEmpty } from 'class-validator';

export class CreateCustomerDto {
    @IsNotEmpty({ message: 'Tên không được để trống' })
    @ApiProperty()
    name: string;

    @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
    @IsMobilePhone(null, {}, { message: 'Số điện thoại không hợp lệ' })
    @ApiProperty()
    phone: string;

    @IsEmail({}, { message: 'Địa chỉ email không hợp lệ' })
    @ApiProperty()
    email: string;

    @IsNotEmpty({ message: 'Tên công ty không được để trống' })
    @ApiProperty()
    company_name: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    status: number;
}
