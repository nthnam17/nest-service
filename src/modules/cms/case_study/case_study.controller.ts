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
import { CaseStudyService } from './case_study.service';
import { CreateCaseStudyDto } from './dto/create-case_study.dto';
import { FilterCaseStudyDto } from './dto/filter-case_study.dto';
import { UpdateCaseStudyDto } from './dto/update-case_study.dto';

@ApiTags('Chiến dịch điển hình')
@Controller('caseStudy')
@UseInterceptors(LoggingInterceptor)
export class CaseStudyController {
    constructor(
        private readonly caseStudyService: CaseStudyService,
        private readonly responseService: ResponseService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Danh sách tất cả chiến dịch điển hình' })
    async findAll(@Query() payload: FilterCaseStudyDto, @RequestInfo() requestInfo: any) {
        const data = await this.caseStudyService.findAll(payload);
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
    @ApiOperation({ summary: 'Chi tiết chiến dịch điển hình' })
    async findOne(@Param('id') id: number, @RequestInfo() requestInfo: any) {
        const data = await this.caseStudyService.findOne(id);
        if (data) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Lấy chi tiết chiến dịch điển hình thành công',
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
    @ApiOperation({ summary: 'Thêm mới chiến dịch điển hình' })
    @UsePipes(new CustomValidationPipe())
    async create(@Body() createNewDto: CreateCaseStudyDto, @RequestInfo() requestInfo: any) {
        const created = await this.caseStudyService.create(createNewDto);
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
    async update(@Param('id') id: number, @Body() updateOneDto: UpdateCaseStudyDto, @RequestInfo() requestInfo: any) {
        const update = await this.caseStudyService.update(id, updateOneDto);
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
        const user = await this.caseStudyService.findOne(id);
        if (!user) {
            return this.responseService.createResponse(
                HttpStatus.NOT_FOUND,
                'Thông tin không tồn tại',
                requestInfo.requestId,
                requestInfo.at,
            );
        }
        await this.caseStudyService.delete(user);

        return this.responseService.createResponse(
            HttpStatus.OK,
            'Xóa thông tin thành công',
            requestInfo.requestId,
            requestInfo.at,
        );
    }
}
