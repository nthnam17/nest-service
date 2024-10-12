import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    UseInterceptors,
    Query,
    UsePipes,
    ConflictException,
    BadRequestException,
    UseGuards,
    HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseService } from '../../../common/response/response.service';
import { LoggingInterceptor } from '../../../common/interceptors/logging.interceptor';
import { RequestInfo } from '../../../common/request-info.decorator';
import { CustomValidationPipe } from '../../../common/custom-validation-pipe';
import { PermissionsGuard } from '../../../auth/guards/permissions.guard';
import { FilterSliderDto } from './dto/filter.dto';
import { CreateSliderDto } from './dto/create-new.dto';
import { UpdateSliderDto } from './dto/update.dto';
import { SliderService } from './slider.service';

@ApiTags('Slider')
@Controller('slider')
@UseInterceptors(LoggingInterceptor)
export class SliderController {
    constructor(
        private readonly sliderService: SliderService,
        private readonly responseService: ResponseService,
    ) {}

    @Get()
    // @UseGuards(PermissionsGuard)
    @ApiOperation({ summary: 'Danh sách Slider' })
    async findAll(@Query() payload: FilterSliderDto, @RequestInfo() requestInfo: any) {
        const data = await this.sliderService.findAll(payload);
        if (data) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Lấy danh sách Slider thành công',
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
    @ApiOperation({ summary: 'Chi tiết Slider' })
    async findOne(@Param('id') id: number, @RequestInfo() requestInfo: any) {
        const user = await this.sliderService.findOne(id);
        if (!user) {
            return this.responseService.createResponse(
                HttpStatus.NOT_FOUND,
                'Slider không tồn tại',
                requestInfo.requestId,
                requestInfo.at,
            );
        }

        return this.responseService.createResponse(
            HttpStatus.OK,
            'Chi tiết Slider',
            requestInfo.requestId,
            requestInfo.at,
            user,
        );
    }

    @Post()
    @ApiOperation({ summary: 'Thêm mới Slider' })
    @UsePipes(new CustomValidationPipe())
    async create(@Body() createNewDto: CreateSliderDto, @RequestInfo() requestInfo: any) {
        await this.checkExistingFields(createNewDto.slug);

        const createdData = await this.sliderService.create(createNewDto);
        if (createdData) {
            return this.responseService.createResponse(
                HttpStatus.CREATED,
                'Thêm mới thành công',
                requestInfo.requestId,
                requestInfo.at,
                createdData,
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
    @ApiOperation({ summary: 'Cập nhật Slider' })
    @UsePipes(new CustomValidationPipe())
    async update(@Param('id') id: number, @Body() updateOneDto: UpdateSliderDto, @RequestInfo() requestInfo: any) {
        await this.checkExistingFields(updateOneDto.slug, id);

        const updateCategory = await this.sliderService.update(id, updateOneDto);
        if (updateCategory) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Cập nhật thành công',
                requestInfo.requestId,
                requestInfo.at,
                updateCategory,
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
    @ApiOperation({ summary: 'Xóa Slider' })
    async delete(@Param('id') id: number, @RequestInfo() requestInfo: any) {
        //handle error if user does not exist
        const data = await this.sliderService.findOne(id);
        if (!data) {
            return this.responseService.createResponse(
                HttpStatus.NOT_FOUND,
                'Slider không tồn tại',
                requestInfo.requestId,
                requestInfo.at,
            );
        }
        await this.sliderService.delete(data);

        return this.responseService.createResponse(
            HttpStatus.OK,
            'Xóa Slider thành công',
            requestInfo.requestId,
            requestInfo.at,
        );
    }

    /**
     * checkExistingFields
     * @param slug
     * @param idUpdate
     */
    async checkExistingFields(slug: string, idUpdate: number = null) {
        const [existingSlug] = await Promise.all([this.sliderService.findByField('slug', slug)]);

        const errors = {};
        if (existingSlug && (idUpdate === null || idUpdate != existingSlug.id)) {
            errors['title'] = 'Đường dẫn slider đã tồn tại';
        }

        if (Object.keys(errors).length > 0) {
            throw new ConflictException({
                message: [errors],
            });
        }
    }
}
