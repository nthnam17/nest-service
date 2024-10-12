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
import { GalaxyService } from './galaxy.service';
import { CreateGalaxyDto } from './dto/create-galaxy.dto';
import { UpdateGalaxyDto } from './dto/update-galaxy.dto';

@ApiTags('Thông tin vũ trụ Nextads')
@Controller('galaxy')
@UseInterceptors(LoggingInterceptor)
export class GalaxyController {
    constructor(
        private readonly galaxyService: GalaxyService,
        private readonly responseService: ResponseService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Danh sách tất cả thông tin' })
    async findAll(@Query('homePageId') homePageId: number, @RequestInfo() requestInfo: any) {
        const data = await this.galaxyService.findAll(homePageId);
        if (data) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Lấy danh sách thông tin thành công',
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
    @ApiOperation({ summary: 'Chi tiết thông tin' })
    async findOne(@Param('id') id: number, @RequestInfo() requestInfo: any) {
        const data = await this.galaxyService.findOne(id);
        if (data) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Lấy chi tiết tin tức thành công',
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
    @ApiOperation({ summary: 'Thêm mới thông tin' })
    @UsePipes(new CustomValidationPipe())
    async create(@Body() createNewDto: CreateGalaxyDto, @RequestInfo() requestInfo: any) {
        const created = await this.galaxyService.create(createNewDto);
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
    @ApiOperation({ summary: 'Cập nhật thông tin' })
    @UsePipes(new CustomValidationPipe())
    async update(@Param('id') id: number, @Body() updateOneDto: UpdateGalaxyDto, @RequestInfo() requestInfo: any) {
        const update = await this.galaxyService.update(id, updateOneDto);
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
    @ApiOperation({ summary: 'Xóa thông tin' })
    async delete(@Param('id') id: number, @RequestInfo() requestInfo: any) {
        const user = await this.galaxyService.findOne(id);
        if (!user) {
            return this.responseService.createResponse(
                HttpStatus.NOT_FOUND,
                'Thông tin không tồn tại',
                requestInfo.requestId,
                requestInfo.at,
            );
        }
        await this.galaxyService.delete(user);

        return this.responseService.createResponse(
            HttpStatus.OK,
            'Xóa thông tin thành công',
            requestInfo.requestId,
            requestInfo.at,
        );
    }
}
