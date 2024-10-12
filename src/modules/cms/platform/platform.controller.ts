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
import { PlatformService } from './platform.service';
import { FilterPlatformDto } from './dto/filter-platform.dto';
import { CreatePlatformDto } from './dto/create-new-platform.dto';
import { UpdatePlatformDto } from './dto/update-one-platform.dto';

@ApiTags('Nền tảng')
@Controller('platform')
@UseInterceptors(LoggingInterceptor)
export class PlatformController {
    constructor(
        private readonly platformService: PlatformService,
        private readonly responseService: ResponseService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Danh sách tất cả nền tảng' })
    async findAll(@Query() payload: FilterPlatformDto, @RequestInfo() requestInfo: any) {
        const data = await this.platformService.findAll(payload);
        if (data) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Lấy danh sách nền tảng thành công',
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
    @ApiOperation({ summary: 'Danh sách chọn tất cả nền tảng' })
    async findSelect(@RequestInfo() requestInfo: any) {
        const data = await this.platformService.findselect();
        if (data) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Lấy danh sách chọn nền tảng thành công',
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
    @ApiOperation({ summary: 'Chi tiết tất cả nền tảng' })
    async findOne(@Param('id') id: number, @RequestInfo() requestInfo: any) {
        const data = await this.platformService.findOne(id);
        if (data) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Lấy Chi tiết nền tảng thành công',
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
    @ApiOperation({ summary: 'Thêm mới nền tảng' })
    @UsePipes(new CustomValidationPipe())
    async create(@Body() createNewDto: CreatePlatformDto, @RequestInfo() requestInfo: any) {
        const created = await this.platformService.create(createNewDto);
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
    @ApiOperation({ summary: 'Cập nhật nền tảng' })
    @UsePipes(new CustomValidationPipe())
    async update(@Param('id') id: number, @Body() updateOneDto: UpdatePlatformDto, @RequestInfo() requestInfo: any) {
        const update = await this.platformService.update(id, updateOneDto);
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
    @ApiOperation({ summary: 'Xóa nền tảng' })
    async delete(@Param('id') id: number, @RequestInfo() requestInfo: any) {
        //handle error if user does not exist
        const user = await this.platformService.findOne(id);
        if (!user) {
            return this.responseService.createResponse(
                HttpStatus.NOT_FOUND,
                'nền tảng không tồn tại',
                requestInfo.requestId,
                requestInfo.at,
            );
        }
        await this.platformService.delete(id);

        return this.responseService.createResponse(
            HttpStatus.OK,
            'Xóa nền tảng thành công',
            requestInfo.requestId,
            requestInfo.at,
        );
    }
}
