import {
    Body,
    ConflictException,
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
import { GamePackageService } from './game_package.service';
import { CreateGamePackageDto } from './dto/create-game_package.dto';
import { UpdatedGamePackageDto } from './dto/update-game_package.dto';
import { FilterGamePackageDto } from './dto/filter-game_package.dto';

@ApiTags('Gói trò chơi')
@Controller('gamePackage')
@UseInterceptors(LoggingInterceptor)
export class GamePackageController {
    constructor(
        private readonly gamePackageService: GamePackageService,
        private readonly responseService: ResponseService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Danh sách tất cả gói trò chơi' })
    async findAll(@Query() params: FilterGamePackageDto, @RequestInfo() requestInfo: any) {
        const data = await this.gamePackageService.findAll(params);
        if (data) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Lấy danh sách gói trò chơi thành công',
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
    @ApiOperation({ summary: 'Chi tiết gói trò chơi' })
    async findOne(@Param('id') id: number, @RequestInfo() requestInfo: any) {
        const data = await this.gamePackageService.findOne(id);
        if (data) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Lấy chi tiết gói trò chơi thành công',
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
    @ApiOperation({ summary: 'Thêm mới gói trò chơi' })
    @UsePipes(new CustomValidationPipe())
    async create(@Body() createNewDto: CreateGamePackageDto, @RequestInfo() requestInfo: any) {
        const created = await this.gamePackageService.create(createNewDto);
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
    @ApiOperation({ summary: 'Cập nhật gói trò chơi' })
    @UsePipes(new CustomValidationPipe())
    async update(
        @Param('id') id: number,
        @Body() updateOneDto: UpdatedGamePackageDto,
        @RequestInfo() requestInfo: any,
    ) {
        const update = await this.gamePackageService.update(id, updateOneDto);
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

    @Put('changeIsHot/:id')
    @ApiOperation({ summary: 'Chuyển trạng thái gói trò chơi hot' })
    @UsePipes(new CustomValidationPipe())
    async changeIsHot(@Param('id') id: number, @RequestInfo() requestInfo: any) {
        const update = await this.gamePackageService.changeIsHot(id);
        if (update) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Chuyển trạng thái thành công',
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
    @ApiOperation({ summary: 'Xóa gói trò chơi' })
    async delete(@Param('id') id: number, @RequestInfo() requestInfo: any) {
        const user = await this.gamePackageService.findOne(id);
        if (!user) {
            return this.responseService.createResponse(
                HttpStatus.NOT_FOUND,
                'gói trò chơi không tồn tại',
                requestInfo.requestId,
                requestInfo.at,
            );
        }
        await this.gamePackageService.delete(user);

        return this.responseService.createResponse(
            HttpStatus.OK,
            'Xóa gói trò chơi thành công',
            requestInfo.requestId,
            requestInfo.at,
        );
    }
}
