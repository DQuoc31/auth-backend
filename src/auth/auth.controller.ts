import { Controller, Post, Body, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('user')
@UsePipes(new ValidationPipe({ 
  whitelist: true,           // Loại bỏ fields không có trong DTO
  forbidNonWhitelisted: true // Báo lỗi nếu có fields thừa
}))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED) // Status 201
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK) // Status 200
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}