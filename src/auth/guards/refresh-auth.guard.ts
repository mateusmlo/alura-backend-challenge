import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshAuthGuard extends AuthGuard('refresh') {
  constructor() {
    super();
  }

  handleRequest(err: any, user: any, info: any): any {
    if (!user && info.message == 'invalid signature') {
      throw new UnauthorizedException();
    }
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
