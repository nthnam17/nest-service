import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UseInterceptors,
    UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggingInterceptor } from '../../../common/interceptors/logging.interceptor';
import { ResponseService } from '../../../common/response/response.service';
import { RequestInfo } from '../../../common/request-info.decorator';
import { CustomValidationPipe } from '../../../common/custom-validation-pipe';
import { ContactService } from './contact.service';
import { query } from 'express';
import { FilterContactDto } from './dto/filter-news.dto';

@ApiTags('Thông tin liên hệ')
@Controller('contact')
@UseInterceptors(LoggingInterceptor)
export class ContactController {
    constructor(
        private readonly contactService: ContactService,
        private readonly responseService: ResponseService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Danh sách tất cả thông tin liên hệ' })
    async findAll(@Query() params: FilterContactDto, @RequestInfo() requestInfo: any) {
        const data = await this.contactService.findAll(params);
        if (data) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Lấy danh sách thông tin liên hệ',
                requestInfo.requestId,
                requestInfo.at,
                data,
            );
        } else {
            return this.responseService.createResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Lỗi không xác định. Vui lòng thử lại sau',
                requestInfo.requestId,
                requestInfo.at,
            );
        }
    }

    @Put('changeStatus/:id')
    @ApiOperation({ summary: 'Chuyển trạng thái liên hệ' })
    async changeStatus(@Param('id') id: number, @RequestInfo() requestInfo: any) {
        const data = await this.contactService.changeStatus(id);
        if (data) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Chuyển trạng thái liên hệ thành công',
                requestInfo.requestId,
                requestInfo.at,
                data,
            );
        } else {
            return this.responseService.createResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Lỗi không xác định. Vui lòng thử lại sau',
                requestInfo.requestId,
                requestInfo.at,
            );
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Chi tiết thông tin liên hệ' })
    async findOne(@Param('id') id: number, @RequestInfo() requestInfo: any) {
        const data = await this.contactService.findOne(id);
        if (data) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Lấy chi tiết thông tin',
                requestInfo.requestId,
                requestInfo.at,
                data,
            );
        } else {
            return this.responseService.createResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Lỗi không xác định. Vui lòng thử lại sau',
                requestInfo.requestId,
                requestInfo.at,
            );
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Xóa thông tin' })
    async delete(@Param('id') id: number, @RequestInfo() requestInfo: any) {
        const user = await this.contactService.findOne(id);
        if (!user) {
            return this.responseService.createResponse(
                HttpStatus.NOT_FOUND,
                'Thông tin không tồn tại',
                requestInfo.requestId,
                requestInfo.at,
            );
        }
        await this.contactService.delete(user);

        return this.responseService.createResponse(
            HttpStatus.OK,
            'Xóa thông tin thành công',
            requestInfo.requestId,
            requestInfo.at,
        );
    }
}
