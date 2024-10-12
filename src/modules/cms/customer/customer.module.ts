import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from '../../../common/response/response.service';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { Customer } from './../../../entity/customer.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Customer])],
    controllers: [CustomerController],
    providers: [CustomerService, ResponseService],
    exports: [CustomerService],
})
export class CustomerModule {}
