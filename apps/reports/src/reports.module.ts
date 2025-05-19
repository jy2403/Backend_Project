import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Importación correcta
import { Report, ReportSchema } from './schema/report.schema';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [
    ConfigModule.forRoot(), // Configuración correcta
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }), // Conexión a MongoDB
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]), // Modelo
  ],
  controllers: [ReportsController], // Nombre correcto
  providers: [ReportsService],
})
export class ReportsModule {}