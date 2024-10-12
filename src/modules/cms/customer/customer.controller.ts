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
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-new-customer.dto';
import { FilterCustomerDto } from './dto/filter-customer.dto';
import { UpdateCustomerDto } from './dto/update-one-customer.dto';

@ApiTags('Khách hàng')
@Controller('customer')
@UseInterceptors(LoggingInterceptor)
export class CustomerController {
    constructor(
        private readonly customerService: CustomerService,
        private readonly responseService: ResponseService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Danh sách tất cả khách hàng' })
    async findAll(@Query() payload: FilterCustomerDto, @RequestInfo() requestInfo: any) {
        const data = await this.customerService.findAll(payload);
        if (data) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Lấy danh sách khách hàng thành công',
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

    @Get('select')
    @ApiOperation({ summary: 'Danh sách chọn tất cả khách hàng' })
    async findSelect(@RequestInfo() requestInfo: any) {
        const data = await this.customerService.findselect();
        if (data) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Lấy danh sách chọn khách hàng thành công',
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
    @ApiOperation({ summary: 'Chi tiết khách hàng' })
    async findOne(@Param('id') id: number, @RequestInfo() requestInfo: any) {
        const data = await this.customerService.findOne(id);
        if (data) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Lấy Chi tiết khách hàng thành công',
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
    @ApiOperation({ summary: 'Thêm mới khách hàng' })
    @UsePipes(new CustomValidationPipe())
    async create(@Body() createNewDto: CreateCustomerDto, @RequestInfo() requestInfo: any) {
        const created = await this.customerService.create(createNewDto);
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
    @ApiOperation({ summary: 'Cập nhật khách hàng' })
    @UsePipes(new CustomValidationPipe())
    async update(@Param('id') id: number, @Body() updateOneDto: UpdateCustomerDto, @RequestInfo() requestInfo: any) {
        const update = await this.customerService.update(id, updateOneDto);
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
    @ApiOperation({ summary: 'Xóa khách hàng' })
    async delete(@Param('id') id: number, @RequestInfo() requestInfo: any) {
        const user = await this.customerService.findOne(id);
        if (!user) {
            return this.responseService.createResponse(
                HttpStatus.NOT_FOUND,
                'Khách hàng không tồn tại',
                requestInfo.requestId,
                requestInfo.at,
            );
        }
        await this.customerService.delete(id);

        return this.responseService.createResponse(
            HttpStatus.OK,
            'Xóa nền tảng thành công',
            requestInfo.requestId,
            requestInfo.at,
        );
    }
}
