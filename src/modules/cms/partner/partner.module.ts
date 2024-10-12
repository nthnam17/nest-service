import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partner } from '../../../entity/partner.entity';
import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.service';
import { ResponseService } from '../../../common/response/response.service';

@Module({
    imports: [TypeOrmModule.forFeature([Partner])],
    controllers: [PartnerController],
    providers: [PartnerService, ResponseService],
    exports: [PartnerService],
})
export class PartnerModule {}
