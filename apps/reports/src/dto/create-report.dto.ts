import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ReportCategory } from '../schema/report.schema';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  image_url?: string;

  @IsEnum(ReportCategory)
  category: ReportCategory;
}