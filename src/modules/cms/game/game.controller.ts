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
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { FilterGameDto } from './dto/filter-game.dto';

@ApiTags('Game')
@Controller('game')
@UseInterceptors(LoggingInterceptor)
export class GameController {
    constructor(
        private readonly gameService: GameService,
        private readonly responseService: ResponseService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Danh sách tất cả trò chơi' })
    async findAll(@Query() payload: FilterGameDto, @RequestInfo() requestInfo: any) {
        const data = await this.gameService.findAll(payload);
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

    @Get('select')
    @ApiOperation({ summary: 'Danh sách chọn tất cả trò chơi' })
    async findAllSelect(@RequestInfo() requestInfo: any) {
        const data = await this.gameService.findAllSelect();
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
    @ApiOperation({ summary: 'Chi tiết trò chơi' })
    async findOne(@Param('id') id: number, @RequestInfo() requestInfo: any) {
        const data = await this.gameService.findOne(id);
        if (data) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Lấy chi tiết trò chơi thành công',
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
    @ApiOperation({ summary: 'Thêm mới tin tức' })
    @UsePipes(new CustomValidationPipe())
    async create(@Body() createNewDto: CreateGameDto, @RequestInfo() requestInfo: any) {
        await this.checkExistingFields(createNewDto.slug);

        const created = await this.gameService.create(createNewDto);
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
    @ApiOperation({ summary: 'Cập nhật trò chơi' })
    @UsePipes(new CustomValidationPipe())
    async update(@Param('id') id: number, @Body() updateOneDto: UpdateGameDto, @RequestInfo() requestInfo: any) {
        await this.checkExistingFields(updateOneDto.slug, id);

        const update = await this.gameService.update(id, updateOneDto);
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
    @ApiOperation({ summary: 'Cập nhật trạng thái trò chơi' })
    @UsePipes(new CustomValidationPipe())
    async changeIsHot(@Param('id') id: number, @RequestInfo() requestInfo: any) {
        const update = await this.gameService.changeIsHot(id);
        if (update) {
            return this.responseService.createResponse(
                HttpStatus.OK,
                'Cập nhật trạng thái thành công',
                requestInfo.requestId,
                requestInfo.at,
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
    @ApiOperation({ summary: 'Xóa trò chơi' })
    async delete(@Param('id') id: number, @RequestInfo() requestInfo: any) {
        const user = await this.gameService.findOne(id);
        if (!user) {
            return this.responseService.createResponse(
                HttpStatus.NOT_FOUND,
                'Trò chơi không tồn tại',
                requestInfo.requestId,
                requestInfo.at,
            );
        }
        await this.gameService.delete(user);

        return this.responseService.createResponse(
            HttpStatus.OK,
            'Xóa trò chơi thành công',
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
        const [existingslug] = await Promise.all([this.gameService.findByField('slug', slug)]);

        const errors = {};
        if (existingslug && (idUpdate === null || idUpdate != existingslug.id)) {
            errors['slug'] = 'Đường dẫn đã tồn tại';
        }

        if (Object.keys(errors).length > 0) {
            throw new ConflictException({
                message: [errors],
            });
        }
    }
}
