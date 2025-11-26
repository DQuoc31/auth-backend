import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [
    // Đăng ký User schema với Mongoose
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [AuthController], // Đăng ký controller
  providers: [AuthService], // Đăng ký service
})
export class AuthModule {}