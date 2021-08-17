import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { RequestWithUser } from './interfaces/login-req.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @ApiOperation({ summary: 'sign up new user' })
  @ApiBody({
    schema: {
      description: 'register new user',
      type: 'object',
      properties: {
        username: {
          type: 'string',
          description: 'user name',
        },
        password: {
          type: 'string',
          description: 'user password',
        },
      },
    },
  })
  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.userService.createUser(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'user login' })
  @ApiBody({
    schema: {
      description: 'user login',
      type: 'object',
      properties: {
        username: {
          type: 'string',
          description: 'user name',
        },
        password: {
          type: 'string',
          description: 'user password',
        },
      },
    },
  })
  @Post('/login')
  async login(@Req() req: RequestWithUser) {
    return await this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'user logout' })
  @ApiBody({
    schema: {
      description: 'user logout',
      type: 'object',
      properties: {
        uuid: {
          type: 'string',
          description: 'user session uuid',
        },
      },
    },
  })
  @Post('/logout')
  async logout(@Body('uuid') uuid: string) {
    const response = await this.authService.logout(uuid);
    return { status: response };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'check if auth token is valid' })
  @ApiBearerAuth('Authorization')
  @Get('/ping')
  ping() {
    return { message: 'Autenticated PONG' };
  }

  @UseGuards(RefreshAuthGuard)
  @ApiOperation({ summary: 'refresh user token' })
  @ApiBearerAuth('Authorization')
  @Post('/refresh')
  refresh(@Req() req: RequestWithUser) {
    const user: User = req.user;
    return this.authService.login(user);
  }
}
