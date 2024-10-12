import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from '../../../common/response/response.service';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { Contact } from './../../../entity/contact.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Contact])],
    controllers: [ContactController],
    providers: [ContactService, ResponseService],
    exports: [ContactService],
})
export class ContactModule {}
