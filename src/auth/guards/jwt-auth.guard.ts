import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = context.switchToHttp().getRequest();
    return ctx;
  }

  handleRequest(err: any, user: any, info: any): any {
    if (!user && info instanceof TokenExpiredError)
      throw new UnauthorizedException('Token expirado.');

    if (!user && info instanceof JsonWebTokenError)
      throw new UnauthorizedException('Token inválido.');

    if (err || !user) throw new UnauthorizedException();
  }
}
