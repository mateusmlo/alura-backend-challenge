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

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @ApiOperation({ summary: 'sign in new user' })
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
  @Post('/registrar')
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
  async login(@Req() req) {
    return await this.authService.login(req.user);
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
  refresh(@Req() req) {
    const user: User = req.user;
    return this.authService.login(user);
  }
}
