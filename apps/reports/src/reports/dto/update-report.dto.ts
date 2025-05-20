import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ReportState } from '../schema/report.schema';

export class UpdateReportDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsEnum(ReportState)
  @IsOptional()
  state?: ReportState;
}