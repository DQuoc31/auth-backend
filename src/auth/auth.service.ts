import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Người dùng với email này đã tồn tại');
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 12);

    // Tạo user mới
    const user = await this.userModel.create({
      email,
      password: hashedPassword,
    });

    // Loại bỏ password trước khi trả về
    const { password: _, ...userWithoutPassword } = user.toObject();

    return {
      message: 'Đăng ký người dùng thành công',
      user: userWithoutPassword,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Tìm user bằng email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // So sánh mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Loại bỏ password trước khi trả về
    const { password: _, ...userWithoutPassword } = user.toObject();

    return {
      message: 'Đăng nhập thành công',
      user: userWithoutPassword,
    };
  }
}