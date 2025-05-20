import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report } from './reports/schema/report.schema';
import { CreateReportDto } from './reports/dto/create-report.dto';
import { UpdateReportDto } from './reports/dto/update-report.dto';
import { EmailService } from '@app/email/email.service';
import { User } from '@app/schemas/user.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<Report>,
    @InjectModel(User.name) private userModel: Model<User>,
    private emailService: EmailService,
  ) {}

  async create(
    createReportDto: CreateReportDto,
    user_id: string,
  ): Promise<Report> {
    const newReport = new this.reportModel({
      ...createReportDto,
      user_id,
    });
    const user = await this.userModel.findById(user_id).exec();
    if (!user) {
      throw new Error('User not found');
    }
    await this.emailService.sendStatusEmail(
      user.email,
      user.firstName,
      newReport.title,
      newReport.state,
    );
    return await newReport.save();
  }

  async update(id: string, updateReportDto: UpdateReportDto): Promise<Report> {
    const updatedReport = await this.reportModel.findByIdAndUpdate(
      id,
      updateReportDto,
      { new: true },
    );
    if (!updatedReport) {
      throw new Error('Report not found');
    }
    await this.emailService.sendStatusEmail(
      updatedReport.user_id.email,
      updatedReport.user_id.firstName,
      updatedReport.title,
      updatedReport.state,
    );
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
