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
import { PartnerService } from './partner.service';
import { ResponseService } from '../../../common/response/response.service';
import { RequestInfo } from '../../../common/request-info.decorator';
import { FilterPartnerDto } from './dto/filter-partner.dto';
import { CustomValidationPipe } from '../../../common/custom-validation-pipe';
import { CreateNewsPartnerDto } from './dto/create-new-partner.dto';
import { UpdatePartnerDto } from './dto/update-one-partner.dto';

@ApiTags('Đối tác')
@Controller('partner')
@UseInterceptors(LoggingInterceptor)
export class PartnerController {
    constructor(
        private readonly partnerService: PartnerService,
        private readonly responseService: ResponseService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Danh sách tất cả đối tác' })
    async findAll(@Query() payload: FilterPartnerDto, @RequestInfo() requestInfo: any) {
        const data = await this.partnerService.findAll(payload);
        if (data) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Lấy danh sách đối tác thành công',
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
    @ApiOperation({ summary: 'Chi tiết đối tác' })
    async findOne(@Param('id') id: number, @RequestInfo() requestInfo: any) {
        const data = await this.partnerService.findOne(id);
        if (data) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Lấy Chi tiết đối tác thành công',
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

    @Post()
    @ApiOperation({ summary: 'Thêm mới đối tác' })
    @UsePipes(new CustomValidationPipe())
    async create(@Body() createNewDto: CreateNewsPartnerDto, @RequestInfo() requestInfo: any) {
        const created = await this.partnerService.create(createNewDto);
        if (created) {
            return this.responseService.createResponse(
                HttpStatus.CREATED,
                'Thêm mới thành công',
                requestInfo.requestId,
                requestInfo.at,
                created,
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

    @Put(':id')
    @ApiOperation({ summary: 'Cập nhật đối tác' })
    @UsePipes(new CustomValidationPipe())
    async update(@Param('id') id: number, @Body() updateOneDto: UpdatePartnerDto, @RequestInfo() requestInfo: any) {
        const update = await this.partnerService.update(id, updateOneDto);
        if (update) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Cập nhật thành công',
                requestInfo.requestId,
                requestInfo.at,
                update,
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
    @ApiOperation({ summary: 'Xóa đối tác' })
    async delete(@Param('id') id: number, @RequestInfo() requestInfo: any) {
        //handle error if user does not exist
        const user = await this.partnerService.findOne(id);
        if (!user) {
            return this.responseService.createResponse(
                HttpStatus.NOT_FOUND,
                'Đối tác không tồn tại',
                requestInfo.requestId,
                requestInfo.at,
            );
        }
        await this.partnerService.delete(id);

        return this.responseService.createResponse(
            HttpStatus.OK,
            'Xóa đối tác thành công',
            requestInfo.requestId,
            requestInfo.at,
        );
    }
}
