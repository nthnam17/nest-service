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
import { CreateGameTypeDto } from './dto/create-game_type.dto';
import { GameTypeService } from './game_type.service';

@ApiTags('Thể loại trò chơi')
@Controller('gameType')
@UseInterceptors(LoggingInterceptor)
export class GameTypeController {
    constructor(
        private readonly gameTypeService: GameTypeService,
        private readonly responseService: ResponseService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Danh sách tất cả thể loại trò chơi' })
    async findAll(@RequestInfo() requestInfo: any) {
        const data = await this.gameTypeService.findAll();
        if (data) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Lấy danh sách thể loại trò chơi thành công',
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
    @ApiOperation({ summary: 'Danh sách chọn thể loại trò chơi' })
    async findSelect(@RequestInfo() requestInfo: any) {
        const data = await this.gameTypeService.findSelect();
        if (data) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Lấy danh sách chọn thể loại trò chơi thành công',
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
    @ApiOperation({ summary: 'Chi tiết thể loại trò chơi' })
    async findOne(@Param('id') id: number, @RequestInfo() requestInfo: any) {
        const data = await this.gameTypeService.findOne(id);
        if (data) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Lấy chi tiết thể loại trò chơi thành công',
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
    @ApiOperation({ summary: 'Thêm mới thể loại trò chơi' })
    @UsePipes(new CustomValidationPipe())
    async create(@Body() createNewDto: CreateGameTypeDto, @RequestInfo() requestInfo: any) {
        const created = await this.gameTypeService.create(createNewDto);
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
    @ApiOperation({ summary: 'Cập nhật thể loại trò chơi' })
    @UsePipes(new CustomValidationPipe())
    async update(@Param('id') id: number, @Body() updateOneDto: CreateGameTypeDto, @RequestInfo() requestInfo: any) {
        const update = await this.gameTypeService.update(id, updateOneDto);
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
    @ApiOperation({ summary: 'Xóa thể loại trò chơi' })
    async delete(@Param('id') id: number, @RequestInfo() requestInfo: any) {
        const user = await this.gameTypeService.findOne(id);
        if (!user) {
            return this.responseService.createResponse(
                HttpStatus.NOT_FOUND,
                'thể loại trò chơi không tồn tại',
                requestInfo.requestId,
                requestInfo.at,
            );
        }
        await this.gameTypeService.delete(user);

        return this.responseService.createResponse(
            HttpStatus.OK,
            'Xóa thể loại trò chơi thành công',
            requestInfo.requestId,
            requestInfo.at,
        );
    }
}
