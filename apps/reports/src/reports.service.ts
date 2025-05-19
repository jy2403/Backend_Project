import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report } from './schema/report.schema';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { User } from '../../users/src/user/schema/user.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<Report>,
  ) {}

  async create(createReportDto: CreateReportDto, user_id: string): Promise<Report> {
    const newReport = new this.reportModel({
      ...createReportDto,
      user_id,
    });
    return await newReport.save();
  }

  async update(id: string, updateReportDto: UpdateReportDto): Promise<Report> {
    const updatedReport = await this.reportModel.findByIdAndUpdate(id, updateReportDto, { new: true });
    if (!updatedReport) {
      throw new Error('Report not found');
    }
    return updatedReport;
  }

  async delete(id: string): Promise<void> {
    await this.reportModel.findByIdAndDelete(id);
  }

  async findById(id: string): Promise<Report | null> {
    return await this.reportModel.findById(id).populate('user_id');
  }

  async findAll(): Promise<Report[]> {
    return await this.reportModel.find().populate('user_id');
  }
}