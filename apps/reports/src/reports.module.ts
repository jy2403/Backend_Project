import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Importación correcta
import { Report, ReportSchema } from './reports/schema/report.schema';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@app/strategies';
import { User, UserSchema } from '@app/schemas/user.schema';
import { EmailModule } from '@app/email/email.module';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: {
        expiresIn: '1h',
      },
    }),
    EmailModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService, JwtStrategy],
  exports: [JwtStrategy],
})
export class ReportsModule {}
