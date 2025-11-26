import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Bước 1: Cấu hình ConfigModule toàn cục
    ConfigModule.forRoot({
      isGlobal: true,      // Có thể sử dụng ở mọi nơi
      envFilePath: '.env', // Đường dẫn file environment
    }),
    
    // Bước 2: Kết nối MongoDB (async configuration)
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule để sử dụng ConfigService
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/auth-app',
        // connection options: keep server selection timeout low so deploys don't hang
        // if a DB is not reachable. Adjust as needed for your DB provider.
        connectionOptions: {
          // fail fast (milliseconds) when selecting a server
          serverSelectionTimeoutMS: 5000,
          // how long to try to establish initial TCP connection
          connectTimeoutMS: 10000,
          // don't attempt to auto-create indexes in production
          autoIndex: false,
        },
      }),
      inject: [ConfigService], // Inject ConfigService vào useFactory
    }),
    
    // Bước 3: Import AuthModule
    AuthModule,
  ],
})
export class AppModule {}