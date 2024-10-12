import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../interfaces/custom-request.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: CustomRequest, res: Response, next: NextFunction) {
        const lang = req.headers['x-lang'] || req.headers['X-Lang'];
        if (lang) {
            req['lang_code'] = lang;
        }

        next();
    }
}
